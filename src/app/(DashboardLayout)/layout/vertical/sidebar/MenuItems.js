import { uniqueId } from 'lodash';

import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconAperture,
  IconBuilding,
  IconPlus,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Dashbord',
  },

  {
    id: uniqueId(),
    title: 'Overview',
    icon: IconAperture,
    href: '/',
    chip: 'New',
    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Analytics',
    icon: IconAperture,
    href: '',
    disabled: true,
  },

  {
    navlabel: true,
    subheader: 'Risk Management',
  },
  {
    id: uniqueId(),
    title: 'Risks',
    icon: IconBoxMultiple,
    href: '/risk',
    children: [
      {
        id: uniqueId(),
        title: 'View Risks',
        icon: IconPoint,
        href: '/risk-managment',
      },
      {
        id: uniqueId(),
        title: 'Create New Risk',
        icon: IconPoint,
        href: '/risk-managment/create-risk',
        disabled: true,
        // children: [
        //   {
        //     id: uniqueId(),
        //     title: 'Level 2',
        //     icon: IconPoint,
        //     href: '/l2',
        //   },
        //   {
        //     id: uniqueId(),
        //     title: 'Level 2.1',
        //     icon: IconPoint,
        //     href: '/l2.1',
        //     children: [
        //       {
        //         id: uniqueId(),
        //         title: 'Level 3',
        //         icon: IconPoint,
        //         href: '/l3',
        //       },
        //       {
        //         id: uniqueId(),
        //         title: 'Level 3.1',
        //         icon: IconPoint,
        //         href: '/l3.1',
        //       },
        //     ],
        //   },
        // ],
      },
          {
        id: uniqueId(),
        title: 'Manage Risks Categories',
        icon: IconPoint,
        href: '/risk-managment/risk-categories',
      },
    ],
  },
    {
    id: uniqueId(),
    title: 'Controls',
    icon: IconBoxMultiple,
    href: '/risk-managment/controls',
    children: [
      {
        id: uniqueId(),
        title: 'View Controls',
        icon: IconPoint,
        href: '/risk-managment/controls',
      },
      {
        id: uniqueId(),
        title: 'Create New Control',
        icon: IconPoint,
        href: '/risk-managment/controls/create',
      },
    ],
  },
   {
    id: uniqueId(),
    title: 'Business Units',
    icon: IconBuilding,
    href: '/business-units',
    children: [
      {
        id: uniqueId(),
        title: 'View Business Units',
        icon: IconBuilding,
        href: '/business-units',
      },
      {
        id: uniqueId(),
        title: 'Create New Business Unit',
        icon: IconPlus,
        href: '',
        disabled: true,
      },
    ],
  },
    {
    navlabel: true,
    subheader: 'Audit Management',
    
  },
      {
        id: uniqueId(),
        title: 'View Audits',
        icon: IconPoint,
        href: '',
        disabled: true,
      },
      {
        id: uniqueId(),
        title: 'Asses Previous Violations',
        icon: IconPoint,
        href: '',
        disabled: true,
      },
    
 
 
];

export default Menuitems;
