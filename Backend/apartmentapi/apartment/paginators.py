from rest_framework import pagination


class ApartmentPaginator(pagination.PageNumberPagination):
    page_size = 5


class PostPaginator(pagination.PageNumberPagination):
    page_size = 5


class ItemPaginator(pagination.PageNumberPagination):
    page_size = 2


class ServicePaginator(pagination.PageNumberPagination):
    page_size = 3


class QuestionPaginator(pagination.PageNumberPagination):
    page_size = 3
