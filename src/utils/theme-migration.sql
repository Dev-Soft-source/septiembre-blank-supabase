
-- Comprehensive theme structure migration
-- This creates a hierarchical theme structure with categories, subcategories, and items

-- First, create all level 1 categories
INSERT INTO themes (name, level, category, sort_order) VALUES
('ART', 1, 'ART', 1),
('CULTURE', 1, 'CULTURE', 2),
('DANCE', 1, 'DANCE', 3),
('FOODS & DRINKS', 1, 'FOODS & DRINKS', 4),
('GAMES', 1, 'GAMES', 5),
('HEALTH AND WELLNESS', 1, 'HEALTH AND WELLNESS', 6),
('HOBBIES', 1, 'HOBBIES', 7),
('LANGUAGES', 1, 'LANGUAGES', 8),
('LITERATURE', 1, 'LITERATURE', 9),
('MUSIC', 1, 'MUSIC', 10),
('SCIENCES', 1, 'SCIENCES', 11),
('SPORTS', 1, 'SPORTS', 12),
('TECHNOLOGY', 1, 'TECHNOLOGY', 13);

-- Now create subcategories (level 2) and items (level 3)
-- This will be done with proper parent-child relationships

-- ART items
INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Painting', 3, id, 'ART', 1 FROM themes WHERE name = 'ART' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Sculpture', 3, id, 'ART', 2 FROM themes WHERE name = 'ART' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Photography', 3, id, 'ART', 3 FROM themes WHERE name = 'ART' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Architecture', 3, id, 'ART', 4 FROM themes WHERE name = 'ART' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Design', 3, id, 'ART', 5 FROM themes WHERE name = 'ART' AND level = 1;

-- CULTURE items
INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'History', 3, id, 'CULTURE', 1 FROM themes WHERE name = 'CULTURE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Museums', 3, id, 'CULTURE', 2 FROM themes WHERE name = 'CULTURE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Local Traditions', 3, id, 'CULTURE', 3 FROM themes WHERE name = 'CULTURE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Festivals', 3, id, 'CULTURE', 4 FROM themes WHERE name = 'CULTURE' AND level = 1;

-- DANCE items
INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Ballroom', 3, id, 'DANCE', 1 FROM themes WHERE name = 'DANCE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Latin', 3, id, 'DANCE', 2 FROM themes WHERE name = 'DANCE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Contemporary', 3, id, 'DANCE', 3 FROM themes WHERE name = 'DANCE' AND level = 1;

INSERT INTO themes (name, level, parent_id, category, sort_order)
SELECT 'Traditional', 3, id, 'DANCE', 4 FROM themes WHERE name = 'DANCE' AND level = 1;

-- Continue with other categories...
-- (The migration would continue with all categories)
