from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database configuration - use persistent storage for production
    if os.environ.get('FLASK_ENV') == 'production':
        # For production, use a persistent database URL or Azure SQL
        # For now, use temp directory which is writable in container apps
        database_url = os.environ.get('DATABASE_URL', 'sqlite:////tmp/bitebudget.db')
    else:
        # For development, use local SQLite
        database_url = os.environ.get('DATABASE_URL', 'sqlite:///bitebudget.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS for both local development and production
    # Allow all origins for now to ensure frontend works
    CORS(app, origins='*', allow_headers=['Content-Type', 'Authorization'], methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.receipts import receipts_bp
    from routes.analytics import analytics_bp
    from routes.budget import budget_bp
    from routes.products import products_bp
    from routes.realtime_pricing import realtime_pricing_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(receipts_bp, url_prefix='/api/receipts')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(realtime_pricing_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'BiteBudget API is running'}), 200
    
    @app.route('/')
    def index():
        return jsonify({'message': 'BiteBudget V2 API', 'version': '1.0.0'}), 200
    
    # Create tables
    with app.app_context():
        try:
            # Ensure directory exists for SQLite
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            if 'sqlite:///' in db_uri:
                db_path = db_uri.replace('sqlite:///', '')
                db_dir = os.path.dirname(db_path)
                if db_dir:
                    os.makedirs(db_dir, exist_ok=True)
            db.create_all()
            print(f"Database initialized successfully at: {db_uri}")
        except Exception as e:
            print(f"Database initialization error: {e}")
            # Continue anyway - let the app try to work
    
    return app
