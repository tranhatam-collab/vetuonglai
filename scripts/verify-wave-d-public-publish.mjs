const DEFAULT_TIMEOUT_MS = Number(process.env.VTL_WAVE_D_PUBLISH_TIMEOUT_MS || 12000);

const DOMAINS = [
  {
    key: 'work',
    host: 'work.vetuonglai.com',
    markers: ['WORK', 'Planned', 'Bạn đang ở lớp Planned'],
  },
  {
    key: 'market',
    host: 'market.vetuonglai.com',
    markers: ['MARKET', 'Planned', 'Bạn đang ở lớp Planned'],
  },
  {
    key: 'community',
    host: 'community.vetuonglai.com',
    markers: ['COMMUNITY', 'Planned', 'đang chuẩn bị'],
  },
  {
    key: 'ai',
    host: 'ai.vetuonglai.com',
    markers: ['AI', 'Planned', 'coming soon'],
  },
  {
    key: 'business',
    host: 'business.vetuonglai.com',
    markers: ['BUSINESS', 'planned-safe', 'internal planning'],
  },
];

function parseArgs(argv) {
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    selfTest: argv.includes('--self-test'),
    timeoutMs: (() => {
      const index = argv.indexOf('--timeout-ms');
      if (index === -1) return DEFAULT_TIMEOUT_MS;
      return Number(argv[index + 1] || DEFAULT_TIMEOUT_MS);
    })(),
  };
}

function usageText() {
  return [
    'node scripts/verify-wave-d-public-publish.mjs',
    '',
    'Live publish verify cho Wave D sau khi DNS va Pages deploy da san sang.',
    '',
    'Tuy chon:',
    '  --timeout-ms <ms>   Timeout moi request. Mac dinh: 12000',
    '  --self-test         Chay self-test nhanh cho marker validator.',
    '  --help              Hien huong dan.',
  ].join('\n');
}

function hasMarker(text, markers) {
  return markers.some((marker) => text.includes(marker));
}

function formatErrorMessage(error) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const parts = [];
  if (error.message) {
    parts.push(error.message);
  }

  const cause = error.cause;
  if (cause instanceof Error && cause.message && cause.message !== error.message) {
    parts.push(cause.message);
  } else if (cause && typeof cause === 'object') {
    if (typeof cause.code === 'string') {
      parts.push(cause.code);
    }
    if (typeof cause.hostname === 'string') {
      parts.push(cause.hostname);
    }
  }

  return parts.length > 0 ? parts.join(' | ') : 'unknown_error';
}

async function probe(host, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`https://${host}/`, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      },
    });
    const bodyText = await response.text();
    return {
      ok: true,
      status: response.status,
      bodyText,
      error: '',
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      bodyText: '',
      error: formatErrorMessage(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usageText());
    return;
  }

  if (options.selfTest) {
    if (!hasMarker('BUSINESS planned-safe internal planning', ['planned-safe'])) {
      throw new Error('self-test failed');
    }
    console.log('Wave D public publish self-test passed.');
    return;
  }

  const rows = [];
  for (const domain of DOMAINS) {
    const result = await probe(domain.host, options.timeoutMs);
    if (!result.ok) {
      rows.push({
        domain: domain.key,
        host: domain.host,
        check: 'runtime_reachable',
        ok: false,
        status: result.status,
        note: result.error,
      });
      continue;
    }

    const statusOk = result.status === 200;
    rows.push({
      domain: domain.key,
      host: domain.host,
      check: 'status_200',
      ok: statusOk,
      status: result.status,
      note: statusOk ? '' : `status ${result.status} khong dat gate public publish`,
    });

    const markerOk = hasMarker(result.bodyText, domain.markers);
    rows.push({
      domain: domain.key,
      host: domain.host,
      check: 'planned_safe_marker',
      ok: markerOk,
      status: result.status,
      note: markerOk ? '' : 'khong tim thay marker public/planned-safe bat buoc tren live surface',
    });
  }

  const failed = rows.some((row) => !row.ok);
  const summary = {
    total: rows.length,
    passed: rows.filter((row) => row.ok).length,
    failed: rows.filter((row) => !row.ok).length,
  };

  const decision = {
    publish_ready: !failed,
    summary,
    rows,
    gate_rules: [
      'Tat ca host Wave D phai reachable bang HTTPS.',
      'Tat ca host Wave D phai tra 200 o root surface.',
      'Tat ca host Wave D phai con marker planned-safe/public boundary ro rang.',
    ],
  };

  console.log('Wave D public publish verification');
  console.table(rows);
  console.log(JSON.stringify(decision, null, 2));

  if (failed) {
    throw new Error('Wave D public publish verification failed.');
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
