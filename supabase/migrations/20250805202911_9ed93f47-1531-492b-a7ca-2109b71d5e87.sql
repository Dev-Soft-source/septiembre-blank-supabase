-- Update all 20 demo hotels with unique, contextually appropriate images
-- Each image is selected to match the hotel name, location, and character

-- 1. Coastal Breeze Inn - Carmel-by-the-Sea (Coastal hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9' 
WHERE id = '9b866877-a0e6-4925-8378-f17a00631309';

-- 2. Mountain View Lodge - Estes Park (Mountain lodge)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4' 
WHERE id = 'f3aae399-efbb-448a-b112-167d24539da7';

-- 3. Historic Charleston Inn - Charleston (Historic southern hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1520637736862-4d197d17c35a' 
WHERE id = '788a32ff-b9d4-46e0-9a92-bb571178a933';

-- 4. Desert Oasis Hotel - Sedona (Desert resort)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96' 
WHERE id = 'e7230349-c4e3-45c9-a7a2-21f8a66b04b6';

-- 5. Lakeside Retreat - Grand Rapids (Lakeside hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791' 
WHERE id = 'e944f639-9af1-48a1-a6a7-8605bc466e28';

-- 6. The Pearl District Inn - Portland (Urban boutique hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1566073771259-6a8506099945' 
WHERE id = '8ed05a9c-873c-4a7b-9770-dc82095cb134';

-- 7. South Austin Lodge - Austin (Modern city hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b' 
WHERE id = '984d2175-8f38-439f-af06-052ef8d3f24a';

-- 8. Foothills View Hotel - Boise (Mountain foothills hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa' 
WHERE id = 'cf897d81-bd6f-4a75-afdf-b65a35a384de';

-- 9. Tropical Winds Resort - Key West (Tropical resort)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb' 
WHERE id = '1f9a7d3e-be01-4ace-acf1-65ec44b3c4fa';

-- 10. Capitol View Inn - Madison (Classic city hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1590490360182-c33d57733427' 
WHERE id = 'ff075b77-b608-46fa-9ad5-c477c6b19729';

-- 11. Hampton Inn Providence Downtown - Providence (Downtown business hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7' 
WHERE id = '641d4443-fcce-4587-8b02-bcf001d01005';

-- 12. Wasatch Mountain View Hotel - Salt Lake City (Mountain view hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1619994121345-b4a3c3888ed7' 
WHERE id = 'd4404dc8-4c2a-4162-9e44-f7d862905795';

-- 13. Hilton Virginia Beach Oceanfront - Virginia Beach (Oceanfront hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32' 
WHERE id = 'dd49fc19-1a1f-41b0-9b92-2209652bc565';

-- 14. Riverside Park Hotel - Spokane (Riverside hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f' 
WHERE id = '497da7b1-86db-4883-ab5b-85d88263c69a';

-- 15. Adobe Hills Inn - Santa Fe (Adobe style southwestern hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e' 
WHERE id = 'f57ede41-af63-4653-9775-923bd49df4a2';

-- 16. Gulf Coast Heritage Inn - Mobile (Gulf coast heritage hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21' 
WHERE id = '5996b848-134a-452b-ae43-4de1cb08e2bd';

-- 17. Big Sky Urban Lodge - Billings (Urban lodge)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e' 
WHERE id = 'a6cc5c07-fa3c-4f0d-acce-3f7ed78c6100';

-- 18. Green Mountain Inn - Burlington (Green mountain inn)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1501854140801-50d01698950b' 
WHERE id = '56974c55-9293-46ec-903e-45b26e8b5c11';

-- 19. Historic District Lodge - Savannah (Historic district hotel)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1527576539890-dfa815648363' 
WHERE id = '5033ac10-54bd-43ed-9ec9-8cf3fe290842';

-- 20. Blue Ridge Mountain Lodge - Asheville (Blue Ridge mountain lodge)
UPDATE public.hotels SET main_image_url = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3' 
WHERE id = '6ffcf504-8b60-456f-8564-8507a0714c3e';