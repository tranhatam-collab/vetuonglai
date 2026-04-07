# VETUONGLAI CONTENT MODEL SCHEMA

Version: 1.0
Last updated: 2026-04-07

## Mục đích

Mô tả schema dữ liệu cho content, không viết code.

## Article object

- id
- slug
- title
- summary
- body
- category
- tags
- language
- seo
- status

## Course object

- id
- slug
- title
- description
- outcomes
- modules
- level
- price
- certificate_code
- seo
- status

## Lesson object

- id
- course_id
- slug
- title
- type
- content
- media_url
- order_index
- status

## Story object

- id
- slug
- title
- summary
- body
- proof_links
- status

## Checklist object

- id
- slug
- title
- items
- domain
- status

## Workbook object

- id
- slug
- title
- file_url
- related_domain
- status

## FAQ object

- id
- question
- answer
- category
- language
- status

## Category / tag model

- category: phân loại lớn theo domain hoặc chủ đề
- tag: từ khóa hỗ trợ search và linking

## Language fields

- title_vi
- title_en
- summary_vi
- summary_en

## SEO fields

- meta_title
- meta_description
- og_title
- og_description
- canonical_url

## Proof / verification fields

- proof_links
- vc_code
- evidence_notes

## Status workflow

- draft
- review
- published
- archived
