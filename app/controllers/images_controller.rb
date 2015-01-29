class ImagesController < ApplicationController
  # def index
  # end

  # def new
  # end

  def create
    render body: params
  end

  def show
    # puts params
    # puts request
    # puts user?
    # # puts params
    # # @image = Image.find(1)
    # # #render json: @image

    @image = Image.find(params[:id])
    if @image.nil?
      throw "No Image found" #TODO
    end
    if user?
      render json: [@user, @metadata]
    else
      #need to calculate base stats for image
      render json: @image.base_stats
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

  private
  def user?
    @user = User.find(params[:user_id]) and @metadata = @image.find_by(user_id: params[:user_id]) unless @user or params[:user_id].nil?
  end

end