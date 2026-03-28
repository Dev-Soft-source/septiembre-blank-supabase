
-- Safe migration for activities - handles duplicates gracefully

-- Insert Level 1 categories (main categories) - only if they don't exist
INSERT INTO activities (name, level, category, sort_order) 
SELECT 'Indoor', 1, 'Indoor', 1
WHERE NOT EXISTS (SELECT 1 FROM activities WHERE name = 'Indoor' AND level = 1);

-- Insert Level 2 subcategories - only if they don't exist
WITH indoor_cat AS (SELECT id FROM activities WHERE name = 'Indoor' AND level = 1)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT subcat.name, 2, indoor_cat.id, 'Indoor', subcat.sort_order
FROM (VALUES
    ('Art & Creativity', 1),
    ('Games & Entertainment', 2),
    ('Wellness & Care', 3),
    ('Cooking & Food', 4),
    ('Fitness & Movement', 5),
    ('Language Activities', 6),
    ('Learning & Talks', 7),
    ('Music & Stage', 8),
    ('Cinema & Media', 9),
    ('Tech & Science', 10),
    ('Mind & Balance', 11)
) AS subcat(name, sort_order)
CROSS JOIN indoor_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = subcat.name AND activities.level = 2
);

-- Insert Level 3 activities - Art & Creativity
WITH art_cat AS (SELECT id FROM activities WHERE name = 'Art & Creativity' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, art_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Painting', 1),
    ('Ceramics', 2),
    ('Collage', 3),
    ('Restoration', 4),
    ('Calligraphy', 5)
) AS activity(name, sort_order)
CROSS JOIN art_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = art_cat.id
);

-- Insert Level 3 activities - Games & Entertainment
WITH games_cat AS (SELECT id FROM activities WHERE name = 'Games & Entertainment' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, games_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Board Games', 1),
    ('Card Games', 2),
    ('Escape Room', 3),
    ('Karaoke', 4),
    ('Video Games', 5)
) AS activity(name, sort_order)
CROSS JOIN games_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = games_cat.id
);

-- Insert Level 3 activities - Wellness & Care
WITH wellness_cat AS (SELECT id FROM activities WHERE name = 'Wellness & Care' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, wellness_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Spa', 1),
    ('Massage', 2),
    ('Facial Care', 3),
    ('Hair Salon', 4)
) AS activity(name, sort_order)
CROSS JOIN wellness_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = wellness_cat.id
);

-- Insert Level 3 activities - Cooking & Food
WITH cooking_cat AS (SELECT id FROM activities WHERE name = 'Cooking & Food' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, cooking_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Cooking Classes', 1),
    ('Wine Tasting', 2),
    ('Baking', 3),
    ('Pastry', 4)
) AS activity(name, sort_order)
CROSS JOIN cooking_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = cooking_cat.id
);

-- Insert Level 3 activities - Fitness & Movement
WITH fitness_cat AS (SELECT id FROM activities WHERE name = 'Fitness & Movement' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, fitness_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Gym', 1),
    ('Pilates', 2),
    ('Indoor Yoga', 3),
    ('Dance Classes', 4)
) AS activity(name, sort_order)
CROSS JOIN fitness_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = fitness_cat.id
);

-- Insert Level 3 activities - Language Activities
WITH language_cat AS (SELECT id FROM activities WHERE name = 'Language Activities' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, language_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Language Courses', 1),
    ('Language Exchange', 2),
    ('Conversation Clubs', 3),
    ('Multilingual Games', 4)
) AS activity(name, sort_order)
CROSS JOIN language_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = language_cat.id
);

-- Insert Level 3 activities - Learning & Talks
WITH learning_cat AS (SELECT id FROM activities WHERE name = 'Learning & Talks' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, learning_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Workshops', 1),
    ('Courses', 2),
    ('Lectures', 3),
    ('Book Club', 4)
) AS activity(name, sort_order)
CROSS JOIN learning_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = learning_cat.id
);

-- Insert Level 3 activities - Music & Stage
WITH music_cat AS (SELECT id FROM activities WHERE name = 'Music & Stage' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, music_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Live Music', 1),
    ('Chamber Theater', 2),
    ('Opera Night', 3)
) AS activity(name, sort_order)
CROSS JOIN music_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = music_cat.id
);

-- Insert Level 3 activities - Cinema & Media
WITH cinema_cat AS (SELECT id FROM activities WHERE name = 'Cinema & Media' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, cinema_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Film Screenings', 1),
    ('Movie Talks', 2),
    ('TV Discussions', 3)
) AS activity(name, sort_order)
CROSS JOIN cinema_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = cinema_cat.id
);

-- Insert Level 3 activities - Tech & Science
WITH tech_cat AS (SELECT id FROM activities WHERE name = 'Tech & Science' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, tech_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('VR', 1),
    ('Robotics', 2),
    ('AI Demos', 3)
) AS activity(name, sort_order)
CROSS JOIN tech_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = tech_cat.id
);

-- Insert Level 3 activities - Mind & Balance
WITH mind_cat AS (SELECT id FROM activities WHERE name = 'Mind & Balance' AND level = 2)
INSERT INTO activities (name, level, parent_id, category, sort_order)
SELECT activity.name, 3, mind_cat.id, 'Indoor', activity.sort_order
FROM (VALUES
    ('Meditation', 1),
    ('Mindfulness', 2),
    ('Journaling', 3)
) AS activity(name, sort_order)
CROSS JOIN mind_cat
WHERE NOT EXISTS (
    SELECT 1 FROM activities 
    WHERE activities.name = activity.name AND activities.level = 3 
    AND activities.parent_id = mind_cat.id
);
