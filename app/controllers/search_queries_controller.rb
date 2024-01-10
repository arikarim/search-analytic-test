class SearchQueriesController < ApplicationController
  def index
    @search_queries = SearchQuery.group(:query).order(Arel.sql('COUNT(query) DESC')).limit(10).count
  end

  def create
    query = search_query_params[:query].strip

    record = current_user.search_queries.where("LOWER(?) LIKE CONCAT(query, '%')", query.downcase).first
    similar_searches = SearchQuery.where('LOWER(query) LIKE ?',
    "#{query.downcase}%")

    if record.blank?
      @record_that_is_part_of_other = current_user.search_queries.where('LOWER(query) LIKE ?',
                                                                        "#{query.downcase}%").first
    end

    if record.present? || @record_that_is_part_of_other.present?
      if @record_that_is_part_of_other.present?
        return render json: similar_searches
      end

      record.update(query:, ip_address: request.remote_ip, user_id: current_user.id,
                    downcased_query: query.downcase)

    else
      # If it's a new search, save the previous complete search in the database
      SearchQuery.create!(query: query, ip_address: request.remote_ip, user_id: current_user.id,
                          downcased_query: query)
    end


    render json: similar_searches
  end

  def popular
    @search_queries = SearchQuery.group(:query).order(Arel.sql('COUNT(query) DESC')).limit(10).count
  end

  private

  def search_query_params
    params.require(:search_query).permit(:query, :ip_address)
  end
end
