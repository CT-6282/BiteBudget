from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Budget, db
from datetime import datetime, timedelta

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        user_id = get_jwt_identity()
        budgets = Budget.query.filter_by(user_id=user_id).order_by(Budget.created_at.desc()).all()
        
        return jsonify({
            'budgets': [budget.to_dict() for budget in budgets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Calculate end date based on period
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        period = data.get('period', 'monthly')
        
        if period == 'weekly':
            end_date = start_date + timedelta(weeks=1)
        elif period == 'monthly':
            end_date = start_date + timedelta(days=30)
        elif period == 'yearly':
            end_date = start_date + timedelta(days=365)
        else:
            end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        budget = Budget(
            user_id=user_id,
            name=data['name'],
            total_budget=data['total_budget'],
            category=data.get('category', 'General'),
            period=period,
            start_date=start_date,
            end_date=end_date
        )
        
        db.session.add(budget)
        db.session.commit()
        
        return jsonify({
            'message': 'Budget created successfully',
            'budget': budget.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        data = request.get_json()
        
        budget.name = data.get('name', budget.name)
        budget.total_budget = data.get('total_budget', budget.total_budget)
        budget.category = data.get('category', budget.category)
        budget.spent_amount = data.get('spent_amount', budget.spent_amount)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Budget updated successfully',
            'budget': budget.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        
        if not budget:
            return jsonify({'error': 'Budget not found'}), 404
        
        db.session.delete(budget)
        db.session.commit()
        
        return jsonify({'message': 'Budget deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@budget_bp.route('/summary', methods=['GET'])
@jwt_required()
def budget_summary():
    try:
        user_id = get_jwt_identity()
        budgets = Budget.query.filter_by(user_id=user_id).all()
        
        total_budgets = len(budgets)
        total_allocated = sum(budget.total_budget for budget in budgets)
        total_spent = sum(budget.spent_amount for budget in budgets)
        total_remaining = total_allocated - total_spent
        
        active_budgets = [
            budget for budget in budgets 
            if budget.start_date <= datetime.now() <= budget.end_date
        ]
        
        return jsonify({
            'summary': {
                'total_budgets': total_budgets,
                'active_budgets': len(active_budgets),
                'total_allocated': total_allocated,
                'total_spent': total_spent,
                'total_remaining': total_remaining,
                'budget_utilization': (total_spent / total_allocated * 100) if total_allocated > 0 else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
