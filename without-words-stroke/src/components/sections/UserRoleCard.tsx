'use client';

import React from 'react';
import { Button } from '../ui';
import { Card } from '../ui';
import { LucideIcon } from 'lucide-react';

interface UserRoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
  onClick: () => void;
}

/**
 * 🎯 Карточка роли пользователя для WWS
 * Адаптивная карточка с анимацией и градиентами
 */
export const UserRoleCard: React.FC<UserRoleCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  features,
  onClick
}) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 hover:border-primary/30 bg-gradient-to-br from-card to-secondary/30">
      <div className="p-6">
        {/* Header */}
        <div className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-12 h-12 text-primary" style={{ color }} />
          </div>
          <h3 className="text-xl heading-medical mb-2">{title}</h3>
          <p className="text-supportive">{description}</p>
        </div>
        
        {/* Features */}
        <div className="pt-0">
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-supportive">
                <div className="w-2 h-2 rounded-full bg-primary/60" />
                {feature}
              </li>
            ))}
          </ul>
          
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full group-hover:scale-105 transition-transform duration-300"
            onClick={onClick}
          >
            Войти как {title}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserRoleCard;
