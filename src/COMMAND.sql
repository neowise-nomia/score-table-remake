-- get all table
SELECT tbl_name from sqlite_master WHERE type = "table";
-- create table 
CREATE TABLE tb (id INT(10), sbj NVARCHAR(20), mark JSON);
-- Insert value
INSERT INTO tb (id, sbj, mark) VALUES (?, ?, ?);