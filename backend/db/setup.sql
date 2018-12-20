/*
CREATE DATABASE serialhistory
  WITH ENCODING='UTF8'
       OWNER=serialhistory
       CONNECTION LIMIT=-1;
*/


-- create records table and it's indexes
CREATE TABLE IF NOT EXISTS records (
   created_at timestamp with time zone NOT NULL DEFAULT NOW(),
   created_by text NOT NULL,
   serial_number character(7) NOT NULL,
   product_code character(7) NOT NULL,
   sales_order character varying(20),
   customer_id_sold character varying(20),
   customer_id_ship character varying(20),
   description text NOT NULL,
   warranty_to date CHECK (warranty_to > '2000-01-01'),
   PRIMARY KEY (created_at, serial_number)
)
WITH (
  OIDS = FALSE
);
CREATE INDEX IF NOT EXISTS customer_id_sold_idx ON records USING btree (customer_id_sold);
CREATE INDEX IF NOT EXISTS customer_id_ship_idx ON records USING btree (customer_id_ship);
CREATE INDEX IF NOT EXISTS product_code_idx ON records USING btree (product_code);
CREATE INDEX IF NOT EXISTS serial_number_idx ON records USING btree (serial_number);

-- create product_serial sequence
CREATE SEQUENCE IF NOT EXISTS product_serial
   INCREMENT 1
   START 1
   MINVALUE 1;

-- create generate_serial function
CREATE OR REPLACE FUNCTION generate_serial() RETURNS varchar AS $$
DECLARE
	serial INT;
	result VARCHAR;
BEGIN
	SELECT INTO serial nextval('product_serial');

	IF serial > 998 then
		ALTER sequence product_serial restart with 1;
	end if;

	result := LPAD(RIGHT(CAST(serial AS text), 3), 3, '0');
	RETURN CONCAT(TO_CHAR(CURRENT_DATE, 'YYMM'), result);
END; $$
LANGUAGE PLPGSQL;

-- create trigger to insert serial_number
CREATE OR REPLACE FUNCTION records_stamp() RETURNS TRIGGER AS $records_stamp$
BEGIN
	IF NEW.serial_number IS NULL OR char_length(NEW.serial_number) < 2 THEN
		NEW.serial_number := generate_serial();
	END IF;
	RETURN NEW;
END;
$records_stamp$ LANGUAGE plpgsql;
DROP trigger if EXISTS records_stamp ON records;
CREATE TRIGGER records_stamp BEFORE INSERT ON records FOR EACH ROW EXECUTE PROCEDURE records_stamp();
