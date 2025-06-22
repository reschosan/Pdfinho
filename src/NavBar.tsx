import { t } from 'i18next'
import { Link, useLocation } from 'react-router-dom'
import {
  Scissors,
  Edit,
  ArrowUpRight,
  User,
  BetweenVerticalEnd,
  Home,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from './components/ui/tooltip'

const navItems = [
  {
    label: t('sidebar.home'),
    icon: <Home size={28} />,
    to: '/',
  },
  {
    label: t('sidebar.combine'),
    icon: <BetweenVerticalEnd size={28} />,
    to: '/combine',
  },
  {
    label: t('sidebar.edit'),
    icon: <Edit size={28} />,
    to: '/editfile',
  },
  {
    label: t('converter.title'),
    icon: <ArrowUpRight size={28} />,
    to: '/convert',
  },
  {
    label: t('sidebar.about'),
    icon: <User size={28} />,
    to: '/about',
  },
]

const NavBar = () => {
  const location = useLocation()

  return (
    <nav className="w-full h-16 sm:h-20 flex flex-row items-center bg-gradient-to-br from-[var(--navbarleft)] via-[#2b7a78] to-[var(--navbarright)] shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="rotate-270 items-center justify-center sm:p-4 sm:flex rounded-[80px] sm:rounded-[8px]">
        <Link to="/" className="flex items-center">
          <Scissors className="text-background size-[24] sm:size-[16]" />
          <span className="rotate-90  font-bold text-background text-[4pt] sm:text-[16pt] tracking-wide font-shantellsans">
            PDF
          </span>
        </Link>
      </div>
      <div className="flex flex-row items-center gap-3 mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <Link
                  to={item.to}
                  className={`flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-lg transition-all bg-background
              ${
                isActive
                  ? 'bg-gradient-to-br from-background to-white border border-primary text-primary shadow'
                  : 'hover:bg-muted/70 border border-transparent text-muted-foreground'
              }
            `}
                >
                  {item.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </nav>
  )
}

export default NavBar
