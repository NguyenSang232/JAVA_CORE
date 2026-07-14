-- ================================================================
-- PET BOARDING — Database Schema
-- Java Web Exam
-- ================================================================

CREATE DATABASE IF NOT EXISTS pet_boarding
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pet_boarding;

-- ================================================================
-- TABLE: owners
-- ================================================================
CREATE TABLE owners (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    phone      VARCHAR(20)  NOT NULL UNIQUE,
    email      VARCHAR(100),
    address    VARCHAR(255),
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE owners
add COLUMN updated_at datetime;
ALTER TABLE owners
add COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
-- ================================================================
-- TABLE: pets
-- ================================================================
CREATE TABLE pets (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    type       VARCHAR(20)  NOT NULL,   -- Dog | Cat | Bird | Rabbit | Other
    breed      VARCHAR(100),
    age        INT          NOT NULL DEFAULT 0,
    weight     DECIMAL(5,2) NOT NULL DEFAULT 0,
    image_url  VARCHAR(500),
    owner_id   BIGINT       NOT NULL,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES owners(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE pets
add COLUMN updated_at datetime;
ALTER TABLE pets
add COLUMN deleted BOOLEAN NOT NULL DEFAULT FALSE;
-- ================================================================
-- TABLE: boarding_records
-- ================================================================
CREATE TABLE boarding_records (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    pet_id           BIGINT      NOT NULL,
    check_in_date    DATE        NOT NULL,
    actual_check_out DATE,
    base_fee         BIGINT,
    late_fee         BIGINT      DEFAULT 0,
    total_fee        BIGINT,
    status           VARCHAR(20) NOT NULL DEFAULT 'BOARDING', -- BOARDING | RETURNED
    notes            TEXT,
    created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_boarding_pet FOREIGN KEY (pet_id) REFERENCES pets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE boarding_records
add COLUMN updated_at datetime;
ALTER TABLE boarding_records
add COLUMN price_per_day BIGINT;
ALTER TABLE boarding_records
add COLUMN expected_day datetime;
-- ================================================================
-- TABLE: care_notes
-- ================================================================
CREATE TABLE care_notes (
    id                 BIGINT   NOT NULL AUTO_INCREMENT,
    boarding_record_id BIGINT   NOT NULL,
    note               TEXT     NOT NULL,
    created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_note_boarding FOREIGN KEY (boarding_record_id)
        REFERENCES boarding_records(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- TABLE: users
-- ================================================================
CREATE TABLE users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    username   VARCHAR(50)  NOT NULL UNIQUE,  -- dùng phone number
    password   VARCHAR(255) NOT NULL,         -- BCrypt encoded
    role       VARCHAR(20)  NOT NULL,         -- ROLE_ADMIN | ROLE_CUSTOMER
    owner_id   BIGINT,                        -- NULL nếu là ADMIN
    enabled    TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_owner FOREIGN KEY (owner_id) REFERENCES owners(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- SAMPLE DATA
-- ================================================================

-- ── Owners ──────────────────────────────────────────────────────
INSERT INTO owners (id, name, phone, email, address) VALUES
(1, 'Nguyễn Văn An',   '0901234567', 'an@email.com',      '123 Lê Lợi, Q1, TP.HCM'),
(2, 'Trần Thị Bình',   '0912345678', 'binh@email.com',    '45 Nguyễn Huệ, Q1, TP.HCM'),
(3, 'Lê Minh Cường',   '0923456789', 'cuong@email.com',   '78 Trần Hưng Đạo, Q5, TP.HCM'),
(4, 'Phạm Thị Dung',   '0934567890', 'dung@email.com',    '12 CMT8, Q3, TP.HCM'),
(5, 'Hoàng Văn Em',    '0945678901', 'em@email.com',      '56 Điện Biên Phủ, Q10, TP.HCM'),
(6, 'Võ Thị Phương',   '0956789012', 'phuong@email.com',  '34 Nam Kỳ Khởi Nghĩa, Q3, TP.HCM');

-- ── Pets ────────────────────────────────────────────────────────
INSERT INTO pets (id, name, type, breed, age, weight, image_url, owner_id) VALUES
(1, 'Milo',   'Dog',    'Golden Retriever', 3, 28.50, 'https://placedog.net/200/200?id=1',  1),
(2, 'Kiki',   'Cat',    'Anh lông ngắn',    2,  4.20, 'https://placekitten.com/200/200',    1),
(3, 'Buddy',  'Dog',    'Poodle',           5,  6.80, 'https://placedog.net/200/200?id=2',  2),
(4, 'Tweety', 'Bird',   'Vẹt Cockatiel',    1,  0.10, NULL,                                 3),
(5, 'Snow',   'Rabbit', 'Holland Lop',      2,  1.80, NULL,                                 4),
(6, 'Max',    'Dog',    'Husky',            4, 25.00, 'https://placedog.net/200/200?id=3',  5),
(7, 'Luna',   'Cat',    'Mèo Ta',           3,  3.50, 'https://placekitten.com/201/200',    6),
(8, 'Nemo',   'Other',  'Rùa cạn',          8,  0.80, NULL,                                 2);

-- ── Boarding Records ────────────────────────────────────────────
-- Record 1: Milo đang gửi (BOARDING) — base_fee/total_fee NULL vì chưa check-out
INSERT INTO boarding_records
    (id, pet_id, check_in_date, actual_check_out,
     base_fee, late_fee, total_fee, status, notes)
VALUES
(1, 1, '2025-05-20', NULL,
 NULL, 0, NULL, 'BOARDING', 'Cho ăn 2 lần/ngày, không ăn xúc xích'),

-- Record 2: Buddy đang gửi (BOARDING)
(2, 3, '2025-05-18', NULL,
 NULL, 0, NULL, 'BOARDING', 'Dị ứng thức ăn có gà'),

-- Record 3: Snow đang gửi (BOARDING)
(3, 5, '2025-05-21', NULL,
 NULL, 0, NULL, 'BOARDING', 'Cho ăn rau cải, cà rốt'),

-- Record 4: Max đã trả đúng hạn (RETURNED, không trễ, không discount)
(4, 6, '2025-05-15', '2025-05-22',
 1260000, 0, 1260000, 'RETURNED', ''),

-- Record 5: Kiki đã trả trễ 2 ngày (RETURNED, có late fee)
-- base_fee = 900000, late_fee = 40000, total = 940000
(5, 2, '2025-05-10', '2025-05-19',
 900000, 40000, 940000, 'RETURNED', 'Hay trốn, cẩn thận cửa'),

-- Record 6: Luna đã trả đúng hạn (RETURNED)
(6, 7, '2025-05-01', '2025-05-10',
 900000, 0, 900000, 'RETURNED', ''),

-- Record 7: Tweety đã trả đúng hạn (RETURNED)
(7, 4, '2025-04-10', '2025-04-17',
 420000, 0, 420000, 'RETURNED', ''),

-- Record 8: Buddy lần trước — đúng hạn (RETURNED)
(8, 3, '2025-03-01', '2025-03-06',
 600000, 0, 600000, 'RETURNED', 'Lần đầu gửi');

-- ── Care Notes ──────────────────────────────────────────────────
INSERT INTO care_notes (boarding_record_id, note) VALUES
-- Notes cho Record 1 (Milo đang gửi)
(1, 'Milo đã được tắm buổi sáng, rất vui vẻ'),
(1, 'Ăn hết khẩu phần trưa, chơi đùa với nhân viên'),
(1, 'Ngủ ngoan buổi chiều, sức khỏe tốt'),

-- Notes cho Record 2 (Buddy đang gửi)
(2, 'Buddy đã uống thuốc dị ứng buổi sáng'),
(2, 'Ăn ít hơn bình thường, theo dõi thêm'),

-- Notes cho Record 3 (Snow đang gửi)
(3, 'Snow ăn rau cải tốt, hoạt bát'),

-- Notes cho Record 5 (Kiki đã trả)
(5, 'Kiki đã ăn sáng đầy đủ'),
(5, 'Hơi lười vận động, bình thường với mèo');

-- ── Users ───────────────────────────────────────────────────────
-- Password cho tất cả: Test@1234
-- BCrypt hash của "Test@1234":
-- $2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK

INSERT INTO users (id, username, password, role, owner_id) VALUES
-- Admin account (không liên kết owner)
(1, 'admin',
 '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK',
 'ROLE_ADMIN', NULL),

-- Customer accounts (liên kết với owner qua phone)
(2, '0901234567',
 '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK',
 'ROLE_CUSTOMER', 1),

(3, '0912345678',
 '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK',
 'ROLE_CUSTOMER', 2),

(4, '0956789012',
 '$2a$10$EFrva6Zd9Ed2zYcM2s5Qw.DbXQ4eRX4xfq3EXauwrgI2QTc26lyvK',
 'ROLE_CUSTOMER', 6);

-- ================================================================
-- Tài khoản đăng nhập:
--   Admin    : username=admin         / password=Test@1234
--   Customer : username=0901234567    / password=Test@1234  (Nguyễn Văn An)
--              username=0912345678    / password=Test@1234  (Trần Thị Bình)
--              username=0956789012    / password=Test@1234  (Võ Thị Phương)