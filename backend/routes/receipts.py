from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Receipt, ReceiptItem, db
from datetime import datetime
import json

receipts_bp = Blueprint('receipts', __name__)

@receipts_bp.route('/', methods=['GET'])
@jwt_required()
def get_receipts():
    try:
        user_id = get_jwt_identity()
        receipts = Receipt.query.filter_by(user_id=user_id).order_by(Receipt.purchase_date.desc()).all()
        
        return jsonify({
            'receipts': [receipt.to_dict() for receipt in receipts]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@receipts_bp.route('/', methods=['POST'])
@jwt_required()
def create_receipt():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        receipt = Receipt(
            user_id=user_id,
            store_name=data['store_name'],
            total_amount=data['total_amount'],
            purchase_date=datetime.fromisoformat(data['purchase_date'].replace('Z', '+00:00'))
        )
        
        db.session.add(receipt)
        db.session.flush()  # To get the receipt ID
        
        # Add items
        for item_data in data.get('items', []):
            item = ReceiptItem(
                receipt_id=receipt.id,
                product_name=item_data['product_name'],
                quantity=item_data.get('quantity', 1),
                unit_price=item_data['unit_price'],
                total_price=item_data['total_price'],
                category=item_data.get('category', 'Other')
            )
            db.session.add(item)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Receipt created successfully',
            'receipt': receipt.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@receipts_bp.route('/<int:receipt_id>', methods=['GET'])
@jwt_required()
def get_receipt(receipt_id):
    try:
        user_id = get_jwt_identity()
        receipt = Receipt.query.filter_by(id=receipt_id, user_id=user_id).first()
        
        if not receipt:
            return jsonify({'error': 'Receipt not found'}), 404
        
        return jsonify({'receipt': receipt.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@receipts_bp.route('/<int:receipt_id>', methods=['DELETE'])
@jwt_required()
def delete_receipt(receipt_id):
    try:
        user_id = get_jwt_identity()
        receipt = Receipt.query.filter_by(id=receipt_id, user_id=user_id).first()
        
        if not receipt:
            return jsonify({'error': 'Receipt not found'}), 404
        
        db.session.delete(receipt)
        db.session.commit()
        
        return jsonify({'message': 'Receipt deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@receipts_bp.route('/scan', methods=['POST'])
@jwt_required()
def scan_receipt():
    """Mock receipt scanning endpoint - in production this would use OCR"""
    try:
        # This is a mock implementation - replace with actual OCR logic
        mock_receipt_data = {
            'store_name': 'SuperMart',
            'total_amount': 45.67,
            'purchase_date': datetime.now().isoformat(),
            'items': [
                {
                    'product_name': 'Organic Bananas',
                    'quantity': 2,
                    'unit_price': 1.99,
                    'total_price': 3.98,
                    'category': 'Fruits'
                },
                {
                    'product_name': 'Whole Milk',
                    'quantity': 1,
                    'unit_price': 4.50,
                    'total_price': 4.50,
                    'category': 'Dairy'
                },
                {
                    'product_name': 'Chicken Breast',
                    'quantity': 1,
                    'unit_price': 12.99,
                    'total_price': 12.99,
                    'category': 'Meat'
                }
            ]
        }
        
        return jsonify({
            'message': 'Receipt scanned successfully',
            'data': mock_receipt_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
