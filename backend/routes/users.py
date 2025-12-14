from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Post

users_bp = Blueprint('users', __name__)

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    current_user = User.query.get(current_user_id)
    user_dict = user.to_dict()
    user_dict['is_following'] = current_user.is_following(user)
    user_dict['is_self'] = current_user_id == user_id
    
    return jsonify(user_dict), 200

@users_bp.route('/<int:user_id>/posts', methods=['GET'])
@jwt_required()
def get_user_posts(user_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    posts = Post.query.filter_by(user_id=user_id)\
        .order_by(Post.created_at.desc()).all()
    
    return jsonify([post.to_dict(current_user_id) for post in posts]), 200

@users_bp.route('/<int:user_id>/follow', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    current_user_id = get_jwt_identity()
    
    if current_user_id == user_id:
        return jsonify({'error': 'Cannot follow yourself'}), 400
    
    current_user = User.query.get(current_user_id)
    user_to_follow = User.query.get(user_id)
    
    if not user_to_follow:
        return jsonify({'error': 'User not found'}), 404
    
    current_user.follow(user_to_follow)
    db.session.commit()
    
    return jsonify({'message': 'Followed successfully', 'user': user_to_follow.to_dict()}), 200

@users_bp.route('/<int:user_id>/unfollow', methods=['POST'])
@jwt_required()
def unfollow_user(user_id):
    current_user_id = get_jwt_identity()
    
    current_user = User.query.get(current_user_id)
    user_to_unfollow = User.query.get(user_id)
    
    if not user_to_unfollow:
        return jsonify({'error': 'User not found'}), 404
    
    current_user.unfollow(user_to_unfollow)
    db.session.commit()
    
    return jsonify({'message': 'Unfollowed successfully', 'user': user_to_unfollow.to_dict()}), 200

@users_bp.route('/<int:user_id>/followers', methods=['GET'])
@jwt_required()
def get_followers(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    followers = user.followers.all()
    return jsonify([u.to_dict() for u in followers]), 200

@users_bp.route('/<int:user_id>/following', methods=['GET'])
@jwt_required()
def get_following(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    following = user.following.all()
    return jsonify([u.to_dict() for u in following]), 200

@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users():
    query = request.args.get('q', '')
    
    if not query:
        return jsonify([]), 200
    
    users = User.query.filter(User.username.ilike(f'%{query}%')).limit(10).all()
    return jsonify([user.to_dict() for user in users]), 200
