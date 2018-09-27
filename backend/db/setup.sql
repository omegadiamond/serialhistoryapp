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
CREATE INDEX IF NOT EXISTS customer_id_idx ON public.records USING btree (customer_id);
CREATE INDEX IF NOT EXISTS product_code_idx ON public.records USING btree (product_code);
CREATE INDEX IF NOT EXISTS serial_number_idx ON public.records USING btree (serial_number);

-- create product_serial sequence
CREATE SEQUENCE IF NOT EXISTS public.product_serial
   INCREMENT 1
   START 1
   MINVALUE 1;

-- create generate_serial function
CREATE OR REPLACE FUNCTION generate_serial() RETURNS varchar AS $$
DECLARE
	next_serial VARCHAR;
BEGIN
	SELECT INTO next_serial nextval('product_serial');
	next_serial := LPAD(next_serial, 4, '0');
	RETURN CONCAT(TO_CHAR(CURRENT_DATE, 'YY'), next_serial);
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
CREATE TRIGGER records_stamp BEFORE INSERT ON public.records FOR EACH ROW EXECUTE PROCEDURE public.records_stamp();
