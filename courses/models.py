from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=128, unique=True)
    short_description = models.CharField(max_length=255)
    description = models.TextField(default=None)
    code = models.TextField(max_length=128)

    def __str__(self):
        return self.name


class Student(models.Model):
    name = models.CharField(verbose_name='Student name', max_length=60)
    surname = models.CharField(verbose_name='Student surname', max_length=60)
    status = models.BooleanField()
    email = models.EmailField(unique=True)
    courses = models.ManyToManyField(Course)

    def __str__(self):
        return "%s %s" % (self.name, self.surname)

    @property
    def full_name(self):
        return '%s %s' % (self.name, self.surname)
