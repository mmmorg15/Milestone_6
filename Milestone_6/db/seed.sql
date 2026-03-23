INSERT INTO moods (code, label)
VALUES
  ('okay', 'Okay'),
  ('sad', 'Sad'),
  ('anxious', 'Anxious'),
  ('frustrated', 'Frustrated'),
  ('numb', 'Numb')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (name, email, password, email_tips)
VALUES
  ('Avery Smith', 'avery@example.com', 'Milestone6!Avery', TRUE),
  ('Jordan Lee', 'jordan@example.com', 'Milestone6!Jordan', FALSE),
  ('Riley Chen', 'riley@example.com', 'Milestone6!Riley', TRUE),
  ('Morgan Patel', 'morgan@example.com', 'Milestone6!Morgan', FALSE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO mood_logs (user_id, mood_id, notes, logged_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'avery@example.com'),
    (SELECT id FROM moods WHERE code = 'anxious'),
    'Feeling overwhelmed before exams, used breathing exercise.',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'jordan@example.com'),
    (SELECT id FROM moods WHERE code = 'sad'),
    'Low energy this morning, reached out to a friend.',
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM users WHERE email = 'riley@example.com'),
    (SELECT id FROM moods WHERE code = 'okay'),
    'Stable day, completed a short walk and hydration goal.',
    NOW() - INTERVAL '6 hours'
  ),
  (
    (SELECT id FROM users WHERE email = 'morgan@example.com'),
    (SELECT id FROM moods WHERE code = 'frustrated'),
    'Work stress was high, paused with grounding steps.',
    NOW() - INTERVAL '3 hours'
  );

INSERT INTO journal_entries (user_id, mood_id, content, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'avery@example.com'),
    (SELECT id FROM moods WHERE code = 'anxious'),
    'I felt tense today but the 4-7-8 breathing cycle helped me settle down.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'jordan@example.com'),
    (SELECT id FROM moods WHERE code = 'sad'),
    'Today was heavy. I listed three things I can control and that helped.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM users WHERE email = 'riley@example.com'),
    (SELECT id FROM moods WHERE code = 'okay'),
    'I am proud that I kept my routine and got outside for sunlight.',
    NOW() - INTERVAL '10 hours',
    NOW() - INTERVAL '10 hours'
  ),
  (
    (SELECT id FROM users WHERE email = 'morgan@example.com'),
    (SELECT id FROM moods WHERE code = 'frustrated'),
    'I took a short break, drank water, and returned to the task more calmly.',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours'
  );

INSERT INTO support_resources (audience, category, title, description, link_or_phone, mood_id, sort_order)
VALUES
  ('crisis', 'hotline', '988 Crisis Lifeline', '24/7 phone support for mental health crisis.', 'tel:988', NULL, 1),
  ('crisis', 'text', 'Text Crisis Line', '24/7 text support for immediate help.', 'sms:988', NULL, 2),
  ('for_me', 'selfcare', 'Wellness Practices', 'Small daily actions to support emotional stability.', NULL, NULL, 1),
  ('for_me', 'coping', 'Coping Techniques', 'Grounding and stress regulation techniques.', NULL, NULL, 2),
  ('for_me', 'journal', 'Therapeutic Journaling', 'Guided writing prompts for processing thoughts.', NULL, NULL, 3),
  ('supporter', 'communication', 'Supportive Communication Guide', 'Evidence-based language for helping a loved one.', NULL, NULL, 1),
  ('supporter', 'risk', 'Risk Assessment Steps', 'How to evaluate urgency and act safely.', 'tel:988', NULL, 2)
ON CONFLICT (audience, title) DO NOTHING;
