
-- Clean Bellagio: keep only amenities that exist in taxonomy_amenities
UPDATE listings
SET amenities = ARRAY(
  SELECT unnest(amenities)
  INTERSECT
  SELECT name FROM taxonomy_amenities WHERE active = true
)
WHERE id = '7e2bf202-9cd3-43c1-9fb6-bf91231be5a6';

-- Clean Durango: keep only amenities that exist in taxonomy_amenities
UPDATE listings
SET amenities = ARRAY(
  SELECT unnest(amenities)
  INTERSECT
  SELECT name FROM taxonomy_amenities WHERE active = true
)
WHERE id = '5dfebbc5-3783-42e1-baff-be0f2a8215fa';
