
-- Insert segment 4 themes data
-- Note: These themes have parent_ids that don't exist in our current structure,
-- so I'll map them to appropriate existing categories based on their content

INSERT INTO themes (id, name, description, category, level, parent_id, sort_order, created_at) VALUES
-- Language learning theme - map to existing Languages conversation category
('30b62e92-e6f3-49e4-85ae-9c71a0be1915', 'Learning Chinese', null, 'LANGUAGES', 3, 'e5828d15-8664-4113-bc05-7f901f3e97f6', 181, now()),

-- Science themes - map to existing Science and Knowledge category
('3ccf5e4b-4d84-4048-8f5a-3f13f1b9a4d5', 'Quantum Physics', null, 'SCIENCE AND KNOWLEDGE', 3, 'b0621f8d-f50e-4dc7-b1b0-921d008d8f95', 182, now()),

-- Sustainability/Nature themes - map to existing Nature categories
('7428f624-96c9-4e68-9a4c-c1037e2cc640', 'Permaculture', null, 'NATURE', 3, 'b606bf36-8d3b-4a16-8c6f-2602d94c1fa2', 183, now()),
('6e2c644f-f7a6-446a-880f-0a94d6b81480', 'Zero Waste Lifestyle', null, 'LIFESTYLE', 3, '8207d78c-a9e0-4229-be5c-bab8c201c581', 193, now()),

-- Cinema theme - map to existing Entertainment category
('aa1d11ea-46ef-42de-99fb-3bd91793a6ed', 'Sci-Fi Movies', null, 'ENTERTAINMENT', 3, 'e052ad1c-314c-46a6-ba64-f2c5a53bb217', 184, now()),

-- Cultural themes - map to existing categories
('ffb14e42-5b73-4a1a-81d8-cbfb28db1357', 'Afrofuturism', null, 'ART', 3, '400a2db1-02d2-43c5-a4f2-0e7be0540e68', 185, now()),

-- Spirituality theme - map to existing Fans spiritual figures category
('b83b64b9-0c53-4f50-bfe0-0a2f951c2e90', 'Native American Spirituality', null, 'FANS', 3, 'c1c71ec2-e4e6-4771-a15a-17a6585597af', 186, now()),

-- Design theme - map to existing Art category
('189a204f-19ee-4a17-a1a2-f44b5c328d74', 'Biodesign', null, 'ART', 3, '400a2db1-02d2-43c5-a4f2-0e7be0540e68', 187, now()),

-- Technology themes - map to existing Science and Technology category
('73a8b3b3-4761-4fcb-9e35-0c2b229258c6', 'Digital Identity', null, 'SCIENCE AND TECHNOLOGY', 3, '42701059-1b85-4d30-905f-bfde32c02020', 188, now()),
('59a69f96-3e2a-4c57-8c10-bf5bb45a5304', 'Transhumanism', null, 'SCIENCE AND TECHNOLOGY', 3, '42701059-1b85-4d30-905f-bfde32c02020', 196, now()),

-- Movement/Dance theme - map to existing Hobbies collecting & games category
('a0178e63-0b6b-4477-bd66-19e4e83a781b', 'Ecstatic Dance', null, 'HOBBIES', 3, 'cc5c158f-2304-4a24-b3d0-a0f0ccbbdf6c', 189, now()),

-- Psychology theme - map to existing Personal Development category
('d916ab33-1b60-4b1c-a788-2c51bbf83755', 'Dream Interpretation', null, 'PERSONAL DEVELOPMENT', 3, '3622c14a-942b-4d14-8afb-5f6daaaf1c24', 190, now()),

-- Fantasy theme - map to existing Entertainment category
('9b28745b-9619-4c80-aab2-2b1e813cf4c7', 'Mythical Creatures', null, 'ENTERTAINMENT', 3, 'e052ad1c-314c-46a6-ba64-f2c5a53bb217', 191, now()),

-- Digital nomadism already exists in segment 2, so we'll skip this duplicate
-- ('f38f1ff7-909d-43f4-9a0a-1d0d8b487612', 'Digital Nomadism', null, 'LIFESTYLE', 3, '3b34baee-445f-4613-9965-80846877e7dc', 192, now()),

-- Wellness theme - map to existing Health and Wellness category
('4bb9bff8-bdc1-46b4-8498-20365e27b08d', 'Sound Healing', null, 'HEALTH AND WELLNESS', 3, '83647603-8b7c-4031-99dc-5da7415714a9', 194, now()),

-- Philosophy theme - map to existing Science and Knowledge category
('d2d5c3e1-2f58-4d18-9bd3-8d837e3ac453', 'Martial Arts Philosophy', null, 'SCIENCE AND KNOWLEDGE', 3, 'b0621f8d-f50e-4dc7-b1b0-921d008d8f95', 195, now());
