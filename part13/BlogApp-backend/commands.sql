CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    URL text NOT NULL,
    title text NOT NULL,
    likes integer
);

insert into blogs (author, URL ,title, likes) values ('Suzuki', "https://en.wikipedia.org/wiki/Ring_(Suzuki_novel)","Ring", 100);

SELECT * FROM blogs;
