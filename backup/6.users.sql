--
-- PostgreSQL database dump
--

\restrict wZYPfisOvE9bdUY3a6YNMuU5UT6mdEfTrFUn1xWb4Vdb4zb0NpRIxJfSaOlVWZ9

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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'admin',
    'user'
);

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(16) NOT NULL,
    email text NOT NULL,
    hash text CONSTRAINT users_password_not_null NOT NULL,
    role public.role DEFAULT 'user'::public.role NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict wZYPfisOvE9bdUY3a6YNMuU5UT6mdEfTrFUn1xWb4Vdb4zb0NpRIxJfSaOlVWZ9

