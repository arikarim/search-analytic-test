class ArticlesController < ApplicationController
  def index
    @articles = Article.all

    redirect_to search_queries_path
  end
end
