class ImagesController < ApplicationController
  # def index
  # end

  # def new
  # end

  def create
    render body: params
  end

  def show

    @image = Image.find params[:id]
    if @image.nil?
      throw "No Image found" #TODO
    end
    if user?
      _render @metadata.info
    else
      #need to calculate base stats for image
      _render @image.info
    end
  end

  # def edit
  # end

  def update
    render body: params
  end

  def destroy
    render body: params
  end

  #overload render to choose the proper output method
  def _render data
    if params[:format] == "json"
      render json: data
    elsif params[:format] == "xml"
      render xml: data
    elsif params[:format] == "yaml"
      # render yaml: data
      render text: data.to_yaml, content_type: "text/yaml"
    end
  end

  private
  def user?
    @user = User.find(params[:user_id]) and @metadata = Metadatum.find_by(user: @user, image: @image) unless @user or params[:user_id].nil?
  end

end