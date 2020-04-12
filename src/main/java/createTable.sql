create table Student
(
	Id int auto_increment
		primary key,
	No varchar(50) charset utf8 null,
	Name varchar(50) charset utf8 null,
	Age int null,
	Birthday date null,
	Photo blob null
);

