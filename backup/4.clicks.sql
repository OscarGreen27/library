--
-- PostgreSQL database dump
--

\restrict OkgsOr2qzS6nkRHSYSKL2cGNaQZyCllM0ZDmICjTOmEj5hKdhbvyI28jeBato4b

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
-- Name: clicks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clicks (
    book_id integer CONSTRAINT clicks_books_id_not_null NOT NULL,
    clicks_count integer DEFAULT 0
);


ALTER TABLE public.clicks OWNER TO postgres;

--
-- Name: clicks clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_pkey PRIMARY KEY (book_id);


--
-- Name: clicks clicks_book_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_book_fk FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- PostgreSQL database dump complete
--

\unrestrict OkgsOr2qzS6nkRHSYSKL2cGNaQZyCllM0ZDmICjTOmEj5hKdhbvyI28jeBato4b

