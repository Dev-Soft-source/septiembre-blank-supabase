-- Delete the specified hotels
DELETE FROM hotels WHERE id IN (
  '9a86e25b-21bd-4374-b93e-9357581646ac', -- Capitol Hill Suites
  'dd49fc19-1a1f-41b0-9b92-2209652bc565'  -- Hilton Virginia Beach Oceanfront
);

-- Update images with more realistic hotel images
UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080' 
WHERE id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100'; -- Big Sky Urban Lodge - modern hotel exterior

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '8ed05a9c-873c-4a7b-9770-dc82095cb134'; -- The Pearl District Inn - boutique hotel lobby

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '6d0e0269-07ed-4599-9c47-ca7496338890'; -- Hampton Inn Anchorage - hotel exterior with mountains

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '5033ac10-54bd-43ed-9ec9-8cf3fe290842'; -- Historic District Lodge - historic hotel facade

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '6ffcf504-8b60-456f-8564-8507a0714c3e'; -- Blue Ridge Mountain Lodge - mountain lodge exterior

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '56974c55-9293-46ec-903e-45b26e8b5c11'; -- Green Mountain Inn - cozy mountain inn

UPDATE hotels SET main_image_url = 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080'
WHERE id = '24a4d8a3-4526-4123-9454-0d3a0536eb79'; -- Hotel Galvez & Spa - elegant hotel exterior