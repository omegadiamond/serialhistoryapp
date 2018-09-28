-- create records table and it's indexes
CREATE TABLE IF NOT EXISTS records (
   created_at timestamp without time zone NOT NULL,
   created_by text NOT NULL,
   serial_number character(6) NOT NULL,
   product_code character(7) NOT NULL,
   sales_order character varying(20) NOT NULL,
   customer_id character varying(20) NOT NULL,
   description text NOT NULL,
   PRIMARY KEY (created_at, serial_number)
)
WITH (
  OIDS = FALSE
);
CREATE INDEX IF NOT EXISTS customer_id_idx ON records USING btree (customer_id);
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
	month INT;
BEGIN
	SELECT INTO serial nextval('product_serial');
	month := extract(month from current_date);

	IF month = 1 AND serial > 500 THEN
	  ALTER SEQUENCE product_serial RESTART WITH 1;
	END IF;

	result := LPAD(CAST(serial AS text), 4, '0');
	RETURN CONCAT(TO_CHAR(CURRENT_DATE, 'YY'), result);
END; $$
LANGUAGE PLPGSQL;

-- create trigger to insert serial_number
CREATE OR REPLACE FUNCTION records_stamp() RETURNS TRIGGER AS $records_stamp$
BEGIN
	IF NEW.serial_number IS NULL THEN
		NEW.serial_number := generate_serial();
	END IF;
	IF NEW.created_at IS NULL THEN
		NEW.created_at := CURRENT_TIMESTAMP;
	END IF;
	RETURN NEW;
END;
$records_stamp$ LANGUAGE plpgsql;
DROP trigger if EXISTS records_stamp ON records;
CREATE TRIGGER records_stamp BEFORE INSERT ON records FOR EACH ROW EXECUTE PROCEDURE records_stamp();
