-- 1. Додавання нових категорій без видалення існуючих та без користувачів/ставок (російська, англійська, китайська)
insert into public.categories (name_ru, name_en, name_zh)
select name_ru, name_en, name_zh
from (values
  ('Электроника', 'Electronics', '电子产品'),
  ('Антиквариат', 'Antiques', '古董'),
  ('Искусство', 'Art', '艺术'),
  ('Транспорт', 'Transport', '交通工具'),
  ('Недвижимость', 'Real Estate', '房地产')
) as new_cats(name_ru, name_en, name_zh)
where not exists (
  select 1 from public.categories where public.categories.name_ru = new_cats.name_ru
);

-- 2. Додавання 5-ти лотів (з оновленням на випадок конфлікту ID)
-- Лот 1 (Электроника)
insert into public.auctions (id, title_ru, title_en, title_zh, description_ru, description_en, description_zh, category_ru, category_en, category_zh, brand, start_price, current_price, end_time, status)
values (
  '11111111-1111-1111-1111-000000000001',
  'Ноутбук ThinkPad X1 Carbon',
  'ThinkPad X1 Carbon Laptop',
  'ThinkPad X1 Carbon 笔记本电脑',
  'Бизнес-ноутбук в отличном состоянии. Intel i7, 16 ГБ ОЗУ, 512 ГБ SSD. Без царапин, полный комплект.',
  'Business laptop in excellent condition. Intel i7, 16 GB RAM, 512 GB SSD. No scratches, full set...',
  '商务笔记本，状况极佳。Intel i7, 16 GB 内存, 512 GB SSD。无划痕，配件齐全...',
  'Электроника', 'Electronics', '电子产品',
  'Lenovo', 13200, 13200,
  timezone('utc'::text, now() + interval '2 days 23 hours 56 minutes 28 seconds'),
  'active'
)
on conflict (id) do update set
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  description_ru = excluded.description_ru,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  category_ru = excluded.category_ru,
  category_en = excluded.category_en,
  category_zh = excluded.category_zh,
  brand = excluded.brand,
  start_price = excluded.start_price,
  current_price = excluded.current_price,
  end_time = excluded.end_time,
  status = excluded.status;

-- Лот 2 (Антиквариат)
insert into public.auctions (id, title_ru, title_en, title_zh, description_ru, description_en, description_zh, category_ru, category_en, category_zh, brand, start_price, current_price, end_time, status)
values (
  '11111111-1111-1111-1111-000000000002',
  'Старинные часы, XIX в.',
  'Antique watch, XIX century',
  '19世纪古董怀表',
  'Карманные часы с гравировкой. Механизм рабочий, требует легкой чистки и профилактики.',
  'Engraved pocket watch. Working mechanism, needs light...',
  '雕花怀表。机芯工作正常，需要轻微...',
  'Антиквариат', 'Antiques', '古董',
  'Невідомий', 9000, 9000,
  timezone('utc'::text, now() + interval '23 hours 56 minutes 28 seconds'),
  'active'
)
on conflict (id) do update set
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  description_ru = excluded.description_ru,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  category_ru = excluded.category_ru,
  category_en = excluded.category_en,
  category_zh = excluded.category_zh,
  brand = excluded.brand,
  start_price = excluded.start_price,
  current_price = excluded.current_price,
  end_time = excluded.end_time,
  status = excluded.status;

-- Лот 3 (Искусство)
insert into public.auctions (id, title_ru, title_en, title_zh, description_ru, description_en, description_zh, category_ru, category_en, category_zh, brand, start_price, current_price, end_time, status)
values (
  '11111111-1111-1111-1111-000000000003',
  'Картина маслом, авторская работа',
  'Oil painting, original work',
  '原创油画',
  'Пейзаж 60x80 см, рама в комплекте. Экспертиза в наличии.',
  'Landscape 60x80 cm, frame included. Expertise available.',
  '风景 60x80 cm，含画框。附带鉴定书。',
  'Искусство', 'Art', '艺术',
  'Невідомий', 16000, 16000,
  timezone('utc'::text, now() + interval '6 days 23 hours 56 minutes 28 seconds'),
  'active'
)
on conflict (id) do update set
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  description_ru = excluded.description_ru,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  category_ru = excluded.category_ru,
  category_en = excluded.category_en,
  category_zh = excluded.category_zh,
  brand = excluded.brand,
  start_price = excluded.start_price,
  current_price = excluded.current_price,
  end_time = excluded.end_time,
  status = excluded.status;

-- Лот 4 (Транспорт)
insert into public.auctions (id, title_ru, title_en, title_zh, description_ru, description_en, description_zh, category_ru, category_en, category_zh, brand, start_price, current_price, end_time, status)
values (
  '11111111-1111-1111-1111-000000000004',
  'Велосипед горный Trek',
  'Trek mountain bike',
  'Trek山地自行车',
  'Алюминиевая рама, 27 скоростей, гидравлические тормоза.',
  'Aluminum frame, 27 speeds, hydraulic brakes.',
  '铝合金车架，27速，液压刹车。',
  'Транспорт', 'Transport', '交通工具',
  'Trek', 7300, 7300,
  timezone('utc'::text, now() + interval '1 day 23 hours 56 minutes 28 seconds'),
  'active'
)
on conflict (id) do update set
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  description_ru = excluded.description_ru,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  category_ru = excluded.category_ru,
  category_en = excluded.category_en,
  category_zh = excluded.category_zh,
  brand = excluded.brand,
  start_price = excluded.start_price,
  current_price = excluded.current_price,
  end_time = excluded.end_time,
  status = excluded.status;

-- Лот 5 (Недвижимость)
insert into public.auctions (id, title_ru, title_en, title_zh, description_ru, description_en, description_zh, category_ru, category_en, category_zh, brand, start_price, current_price, end_time, status)
values (
  '11111111-1111-1111-1111-000000000005',
  'Земельный участок 10 соток',
  'Land plot of 10 acres (1000 sqm)',
  '1000平方米土地',
  'Киевская обл., под застройку, все коммуникации рядом.',
  'Kyiv region, for building, all communications nearby.',
  '基辅地区，可建房，周边设施齐全。',
  'Недвижимость', 'Real Estate', '房地产',
  'Невідомий', 250000, 250000,
  timezone('utc'::text, now() + interval '9 days 23 hours 56 minutes 28 seconds'),
  'active'
)
on conflict (id) do update set
  title_ru = excluded.title_ru,
  title_en = excluded.title_en,
  title_zh = excluded.title_zh,
  description_ru = excluded.description_ru,
  description_en = excluded.description_en,
  description_zh = excluded.description_zh,
  category_ru = excluded.category_ru,
  category_en = excluded.category_en,
  category_zh = excluded.category_zh,
  brand = excluded.brand,
  start_price = excluded.start_price,
  current_price = excluded.current_price,
  end_time = excluded.end_time,
  status = excluded.status;

-- 3. Перевантажуємо кеш схеми API
NOTIFY pgrst, 'reload schema';
