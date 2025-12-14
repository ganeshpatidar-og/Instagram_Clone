from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Post, Like, Comment, User

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('image_url'):
        return jsonify({'error': 'Image URL is required'}), 400
    
    post = Post(
        user_id=user_id,
        image_url=data['image_url'],
        caption=data.get('caption', '')
    )
    
    db.session.add(post)
    db.session.commit()
    
    return jsonify(post.to_dict(user_id)), 201

@posts_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_feed():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    following_ids = [u.id for u in user.following.all()]
    following_ids.append(user_id)
    
    posts = Post.query.filter(Post.user_id.in_(following_ids))\
        .order_by(Post.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict(user_id) for post in posts.items],
        'has_next': posts.has_next,
        'page': page
    }), 200

@posts_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_posts():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    posts = Post.query.order_by(Post.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'posts': [post.to_dict(user_id) for post in posts.items],
        'has_next': posts.has_next,
        'page': page
    }), 200

@posts_bp.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    return jsonify(post.to_dict(user_id)), 200

@posts_bp.route('/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    existing_like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if existing_like:
        return jsonify({'error': 'Already liked'}), 400
    
    like = Like(user_id=user_id, post_id=post_id)
    db.session.add(like)
    db.session.commit()
    
    return jsonify(post.to_dict(user_id)), 200

@posts_bp.route('/<int:post_id>/unlike', methods=['POST'])
@jwt_required()
def unlike_post(post_id):
    user_id = get_jwt_identity()
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
    
    if not like:
        return jsonify({'error': 'Not liked'}), 400
    
    db.session.delete(like)
    db.session.commit()
    
    return jsonify(post.to_dict(user_id)), 200

@posts_bp.route('/<int:post_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(post_id):
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    comments = Comment.query.filter_by(post_id=post_id)\
        .order_by(Comment.created_at.desc()).all()
    
    return jsonify([comment.to_dict() for comment in comments]), 200

@posts_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Comment content is required'}), 400
    
    post = Post.query.get(post_id)
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=data['content']
    )
    
    db.session.add(comment)
    db.session.commit()
    
    return jsonify(comment.to_dict()), 201
