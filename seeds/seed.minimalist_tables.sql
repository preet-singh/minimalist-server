BEGIN;

TRUNCATE
    minimalist_users,
    minimalist_inventory,
    minimalist_items
RESTART IDENTITY CASCADE;

INSERT INTO minimalist_users (user_name, full_name, nickname, password)
VALUES
  ('dunder', 'Dunder Mifflin', null, 'password'),
  ('singhson', 'Preet Singh', 'PS', 'preet-password'),
  ('emery', 'Unai Emery', 'boss man', 'unai-password');

INSERT INTO minimalist_inventory (inventory_name, user_id)
VALUES  
    ('Clothes', 1),
    ('Electronics', 1),
    ('Bedding', 1),
    ('Bulky goods', 2),
    ('Toiletries', 3);

INSERT INTO minimalist_items (item_name, item_description, item_action, inventory_id)
VALUES
    ('formal clothing', 'suits, dresses, ties', 'Keep', 1),
    ('old small electronics', 'game-boy, walkman, PS1', 'Trash', 1),
    ('bedding', 'unused but old - not likely to use', 'Donate', 1),
    ('large household goods', 'Fridge, Washing machine, dryer', 'Keep', 2),
    ('gifted toiletries', 'soap, shower gel, soap bomb', 'Trash', 3);

COMMIT;