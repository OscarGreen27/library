--
-- PostgreSQL database dump
--

\restrict IahbZTZufz6pGYjRQpGJrcnss9IgP9cY9vxYCHqeyfl053BSQIaTb8vfY7rjZHr

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: want; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.want (
    book_id integer CONSTRAINT vant_book_id_not_null NOT NULL,
    want_count integer DEFAULT 0
);


ALTER TABLE public.want OWNER TO postgres;

--
-- Name: want vant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.want
    ADD CONSTRAINT vant_pkey PRIMARY KEY (book_id);


--
-- Name: want vant_book_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.want
    ADD CONSTRAINT vant_book_fk FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- PostgreSQL database dump complete
--

\unrestrict IahbZTZufz6pGYjRQpGJrcnss9IgP9cY9vxYCHqeyfl053BSQIaTb8vfY7rjZHr

