USE library;

INSERT INTO users (email, name, password_hash) VALUES 
('ahmed@mail.com', 'Ahmed Ali', '$2b$12$DummyHashForTesting1234567890'),
('sara@mail.com', 'Sara Mohamed', '$2b$12$DummyHashForTesting1234567890'),
('omar@mail.com', 'Omar Khaled', '$2b$12$DummyHashForTesting1234567890');

INSERT INTO AUTHOR (name, country, user_id, image_url) VALUES 
('Agatha Christie', 'United Kingdom', 1, 'https://images.unsplash.com/photo-1495640388908-05fa85288e61'),
('Dan Brown', 'United States', 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('J.K. Rowling', 'United Kingdom', 2, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Naguib Mahfouz', 'Egypt', 2, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'),
('Paulo Coelho', 'Brazil', 3, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353'),
('Alexandre Dumas', 'France', 3, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6');

INSERT INTO BOOK (title, price, author_id, user_id, image_url) VALUES 
('And Then There Were None', 15.50, 1, 1, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Murder on the Orient Express', 18.00, 1, 1, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('The Da Vinci Code', 22.50, 2, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('Harry Potter and the Sorcerers Stone', 25.00, 3, 2, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc'),
('Palace Walk', 12.00, 4, 2, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'),
('The Alchemist', 14.99, 5, 3, 'https://images.unsplash.com/photo-1532012197267-da84d127e765');