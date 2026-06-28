import React from 'react';
import {
  Rocket,
  Terminal,
  Coins,
  Cpu,
  Shield,
  Globe,
  Database,
  Brain,
  Sparkles,
} from 'lucide-react';

interface NeonIconProps {
  name: string;
  color: string; // 'cyan' | 'emerald' | 'purple' | 'amber' | 'crimson'
  className?: string;
  size?: number;
}

export default function NeonIcon({ name, color, className = '', size = 56 }: NeonIconProps) {
  // Map color to tailwind glow classes & color codes
  const colorMap: Record<string, { stroke: string; glow: string; text: string }> = {
    cyan: {
      stroke: '#22d3ee',
      glow: 'rgba(34,211,238,0.5)',
      text: 'text-cyan-400',
    },
    emerald: {
      stroke: '#34d399',
      glow: 'rgba(52,211,153,0.5)',
      text: 'text-emerald-400',
    },
    purple: {
      stroke: '#c084fc',
      glow: 'rgba(192,132,252,0.5)',
      text: 'text-purple-400',
    },
    amber: {
      stroke: '#fbbf24',
      glow: 'rgba(251,191,36,0.5)',
      text: 'text-amber-400',
    },
    crimson: {
      stroke: '#f87171',
      glow: 'rgba(248,113,113,0.5)',
      text: 'text-red-400',
    },
  };

  const activeColor = colorMap[color] || colorMap.cyan;

  const iconProps = {
    size: size,
    strokeWidth: 1.5,
    className: `${activeColor.text} transition-all duration-300`,
    style: {
      filter: `drop-shadow(0 0 12px ${activeColor.glow})`,
    },
  };

  switch (name.toLowerCase()) {
    case 'rocket':
      return <Rocket {...iconProps} />;
    case 'terminal':
      return <Terminal {...iconProps} />;
    case 'coins':
      return <Coins {...iconProps} />;
    case 'cpu':
      return <Cpu {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'globe':
      return <Globe {...iconProps} />;
    case 'database':
      return <Database {...iconProps} />;
    case 'robot':
    case 'brain':
      return <Brain {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
}
