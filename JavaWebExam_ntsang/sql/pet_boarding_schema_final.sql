-- ================================================================
-- PET BOARDING — Database Schema & Data Seeding (Cập nhật discount_fee)
-- Java Web Exam
-- ================================================================

CREATE DATABASE IF NOT EXISTS pet_boarding_ntsang
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pet_boarding_ntsang;
DROP TABLE IF EXISTS care_notes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS boarding_records;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS prices;
DROP TABLE IF EXISTS owners;

CREATE TABLE owners (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    name           VARCHAR(100) NOT NULL,
    phone          VARCHAR(20)  NOT NULL UNIQUE,
    email          VARCHAR(100),
    address        VARCHAR(255),
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME,
    deleted_at     BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE prices (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    pet_type     VARCHAR(20)  NOT NULL, 
    weight_from  DECIMAL(5,2) NOT NULL,
    weight_to    DECIMAL(5,2) NOT NULL,
    base_price   BIGINT       NOT NULL, 
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pets (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    name         VARCHAR(100) NOT NULL,
    type         VARCHAR(20)  NOT NULL,   
    breed        VARCHAR(100),
    age          INT          NOT NULL DEFAULT 0,
    weight       DECIMAL(5,2) NOT NULL DEFAULT 0,
    image_url    VARCHAR(500),
    owner_id     BIGINT       NOT NULL,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME,
    deleted_at   BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES owners(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE boarding_records (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    pet_id             BIGINT       NOT NULL,
    check_in_date      DATE         NOT NULL,
    expected_day       DATETIME,            
    actual_check_out   DATE,
    price_per_day      BIGINT,               
    base_fee           BIGINT,
    late_fee           BIGINT       DEFAULT 0,
    discount_fee       BIGINT       NOT NULL DEFAULT 0, -- Thêm cột discount_fee mặc định là 0
    total_fee          BIGINT,
    status             VARCHAR(20)  NOT NULL DEFAULT 'BOARDING', 
    notes              TEXT,
    created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_boarding_pet FOREIGN KEY (pet_id) REFERENCES pets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE care_notes (
    id                   BIGINT   NOT NULL AUTO_INCREMENT,
    boarding_record_id   BIGINT   NOT NULL,
    note                 TEXT     NOT NULL,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_note_boarding FOREIGN KEY (boarding_record_id) REFERENCES boarding_records(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    username     VARCHAR(50)  NOT NULL UNIQUE,  
    password     VARCHAR(255) NOT NULL,         
    role         VARCHAR(20)  NOT NULL,         
    owner_id     BIGINT,                        
    enabled      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_owner FOREIGN KEY (owner_id) REFERENCES owners(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO owners (id, name, phone, email, address) VALUES
(1, 'Nguyễn Văn An',   '0901234567', 'an@email.com',      '123 Lê Lợi, Q1, TP.HCM'),
(2, 'Trần Thị Bình',   '0912345678', 'binh@email.com',    '45 Nguyễn Huệ, Q1, TP.HCM'),
(3, 'Lê Minh Cường',   '0923456789', 'cuong@email.com',   '78 Trần Hưng Đạo, Q5, TP.HCM'),
(4, 'Phạm Thị Dung',   '0934567890', 'dung@email.com',    '12 CMT8, Q3, TP.HCM'),
(5, 'Hoàng Văn Em',    '0945678901', 'em@email.com',      '56 Điện Biên Phủ, Q10, TP.HCM'),
(6, 'Võ Thị Phương',   '0956789012', 'phuong@email.com',  '34 Nam Kỳ Khởi Nghĩa, Q3, TP.HCM');

INSERT INTO prices (pet_type, weight_from, weight_to, base_price) VALUES
('Dog',    0.00,  10.00, 120000), 
('Dog',   10.01,  30.00, 180000), 
('Cat',    0.00,  10.00, 100000), 
('Bird',   0.00,   5.00,  60000), 
('Rabbit', 0.00,   5.00,  70000), 
('Other',  0.00,  99.99,  80000); 

INSERT INTO pets (id, name, type, breed, age, weight, image_url, owner_id) VALUES
(1, 'Milo',   'Dog',    'Golden Retriever', 3, 28.50, 'https://placedog.net/200/200?id=1',  1), 
(2, 'Kiki',   'Cat',    'Anh lông ngắn',    2,  4.20, 'https://placekitten.com/200/200',    1), 
(3, 'Buddy',  'Dog',    'Poodle',           5,  6.80, 'https://placedog.net/200/200?id=2',  2), 
(4, 'Tweety', 'Bird',   'Vẹt Cockatiel',    1,  0.10, NULL,                         3), 
(5, 'Snow',   'Rabbit', 'Holland Lop',      2,  1.80, NULL,                         4), 
(6, 'Max',    'Dog',    'Husky',            4, 25.00, 'https://placedog.net/200/200?id=3',  5), 
(7, 'Luna',   'Cat',    'Mèo Ta',           3,  3.50, 'https://placekitten.com/201/200',    6), 
(8, 'Nemo',   'Other',  'Rùa cạn',          8,  0.80, NULL,                         2); 

INSERT INTO boarding_records 
    (id, pet_id, check_in_date, expected_day, actual_check_out, price_per_day, base_fee, late_fee, discount_fee, total_fee, status, notes)
VALUES
(1, 1, '2026-07-15', '2026-07-22 10:00:00', NULL, 180000, 1260000, 0, 0, NULL, 'BOARDING', 'Cho ăn 2 lần/ngày, không ăn xúc xích'),
(2, 3, '2026-07-16', '2026-07-20 12:00:00', NULL, 120000,  480000, 0, 0, NULL, 'BOARDING', 'Dị ứng thức ăn có gà'),
(3, 5, '2026-07-17', '2026-07-21 15:00:00', NULL,  70000,  280000, 0, 0, NULL, 'BOARDING', 'Cho ăn rau cải, cà rốt'),
(4, 6, '2026-05-15', '2026-05-22 09:00:00', '2026-05-22', 180000, 1260000, 0, 0, 1260000, 'RETURNED', ''),
(5, 2, '2026-05-10', '2026-05-17 12:00:00', '2026-05-19', 100000,  900000, 40000, 0,  940000, 'RETURNED', 'Hay trốn, cẩn thận cửa'),
(6, 7, '2026-05-01', '2026-05-10 10:00:00', '2026-05-10', 100000,  900000,    0, 0,  900000, 'RETURNED', ''),
(7, 4, '2026-04-10', '2026-04-17 14:00:00', '2026-04-17',  60000,  420000,    0, 0,  420000, 'RETURNED', ''),
(8, 3, '2026-03-01', '2026-03-06 11:00:00', '2026-03-06', 120000,  600000,    0, 0,  600000, 'RETURNED', 'Lần đầu gửi'),
(9, 7, '2026-07-23', '2026-07-24 00:00:00', '2026-07-23', 100000,  100000,    0, 0,  100000, 'RETURNED', ''),
(10, 4, '2026-07-23', '2026-07-24 00:00:00', NULL,        60000,   60000,    0, 0,    NULL, 'BOARDING', '');

INSERT INTO care_notes (boarding_record_id, note) VALUES
(1, 'Milo đã được tắm buổi sáng, rất vui vẻ'),
(1, 'Ăn hết khẩu phần trưa, chơi đùa với nhân viên'),
(1, 'Ngủ ngoan buổi chiều, sức khỏe tốt'),
(2, 'Buddy đã uống thuốc dị ứng buổi sáng'),
(2, 'Ăn ít hơn bình thường, theo dõi thêm'),
(3, 'Snow ăn rau cải tốt, hoạt bát'),
(5, 'Kiki đã ăn sáng đầy đủ'),
(5, 'Hơi lười vận động, bình thường với mèo');

INSERT INTO users (id, username, password, role, owner_id) VALUES
(1, 'admin', '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK', 'ROLE_ADMIN', NULL),
(2, '0901234567', '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK', 'ROLE_CUSTOMER', 1),
(3, '0912345678', '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK', 'ROLE_CUSTOMER', 2),
(4, '0956789012', '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK', 'ROLE_CUSTOMER', 6);