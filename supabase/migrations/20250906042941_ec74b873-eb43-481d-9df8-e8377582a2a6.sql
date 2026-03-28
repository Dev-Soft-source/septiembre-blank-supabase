-- Call the edge function to get hotel data and populate the database
-- First, let's check current counts
SELECT COUNT(*) as hotel_count FROM hotels;
SELECT COUNT(*) as images_count FROM hotel_images;
SELECT COUNT(*) as activities_count FROM hotel_activities;
SELECT COUNT(*) as affinities_count FROM hotel_affinities;
SELECT COUNT(*) as packages_count FROM availability_packages;