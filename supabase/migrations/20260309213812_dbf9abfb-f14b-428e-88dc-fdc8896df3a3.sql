UPDATE listings SET amenities = array(
  SELECT CASE val
    WHEN 'Centro de Eventos' THEN 'Centro de eventos'
    WHEN 'Centro de Negocios' THEN 'Centro de negocios'
    WHEN 'Check-in Móvil' THEN 'Check-in móvil'
    WHEN 'Estación de Carga para Vehículos Eléctricos' THEN 'Estación de carga para vehículos eléctricos'
    WHEN 'Estacionamiento Gratis' THEN 'Estacionamiento gratis'
    WHEN 'Personal Multilingüe' THEN 'Personal multilingüe'
    WHEN 'Sala de Conferencias' THEN 'Sala de conferencias'
    WHEN 'Salón de Belleza' THEN 'Salón de belleza'
    ELSE val
  END
  FROM unnest(amenities) AS val
)
WHERE amenities IS NOT NULL;