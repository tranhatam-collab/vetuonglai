# VETUONGLAI DATA MODEL MASTER

Version: 1.0
Last updated: 2026-04-07

## Nguyên tắc

Data model toàn hệ phải phục vụ được hành trình con người, không chỉ phục vụ CRUD kỹ thuật.

## User

Mục đích: đại diện một người dùng trong hệ thống.

Fields tối thiểu:

- id
- email
- name
- language
- journey_stage
- created_at
- updated_at

## Profile

- user_id
- persona
- goals
- preferred_domains
- current_focus
- privacy_preferences

## Assessment

- id
- user_id
- version
- answers
- result_type
- recommended_path
- created_at

## Journey stage

- unknown
- lost
- stable
- growth
- builder
- contributor

## Course

- id
- slug
- title
- description
- domain
- level
- status
- duration
- price
- certificate_template

## Lesson

- id
- course_id
- slug
- title
- type
- media_url
- content
- order_index

## Progress

- id
- user_id
- lesson_id
- completed
- score
- last_position
- review_status

## Routine

- id
- domain
- title
- description
- frequency
- difficulty

## Challenge

- id
- domain
- title
- duration
- goals
- completion_rules

## Story

- id
- slug
- title
- summary
- status
- author_type
- proof_links

## Community group

- id
- slug
- name
- type
- status
- moderation_level

## Contribution

- id
- user_id
- domain
- contribution_type
- summary
- evidence
- status

## VC credential

- id
- code
- user_id
- source_domain
- record_type
- status
- issued_at
- anchors

## Project

- id
- slug
- title
- domain
- owner
- status
- impact_type

## Proof record

- id
- related_type
- related_id
- issuer
- hash
- anchors
- visibility

## Notification

- id
- user_id
- type
- payload
- sent_at
- read_at

## Email preference

- user_id
- welcome_opt_in
- progress_opt_in
- reminder_opt_in
- community_opt_in

## Consent logs

- id
- user_id
- consent_type
- version
- granted_at
- revoked_at
