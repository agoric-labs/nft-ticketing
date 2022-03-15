import LosAngelesLakers from './assets/tickets/Lakers.png';
import Coachella2022 from './assets/tickets/Coachella.png';
import AvrilLavigne from './assets/tickets/Avril lavigne.png';
import AfterHours from './assets/tickets/After hours.png';
import MonsterJam from './assets/tickets/Monster Jam.png';

export const images = {
  'Los Angeles Lakers': LosAngelesLakers,
  'Coachella 2022': Coachella2022,
  'Avril Lavigne Bite Me Canada Tour 2022 with Modsun': AvrilLavigne,
  'After Hours Till Dawn Tour': AfterHours,
  'Monster Jam': MonsterJam,
};

// Courtesy of https://twitter.com/lrgmnn/status/813635533658144768/
export const tickets = [
  {
    id: '4cCuxGrhmw1_ccYnuOIXk',
    name: 'Los Angeles Lakers',
    image: '',
    ticketsSold: 45,
    ticketsCount: 500,
    eventDetails: [
      { ticketType: 'Vip', ticketCount: 100, ticketPrice: 400 },
      { ticketType: 'General', ticketCount: 100, ticketPrice: 50 },
      { ticketType: 'Bussiness', ticketCount: 100, ticketPrice: 200 },
    ],
    creatorName: 'Agoric',
  },
  {
    id: '4cCuxGrhmw1_ccYnuOIXk',
    name: 'Coachella 2022',
    image: '',
    salePrice: 99,
    ticketsSold: 905,
    ticketsCount: 5000,
    eventDetails: [
      { ticketType: 'Vip', ticketCount: 100, ticketPrice: 400 },
      { ticketType: 'General', ticketCount: 100, ticketPrice: 50 },
      { ticketType: 'Bussiness', ticketCount: 100, ticketPrice: 200 },
    ],
    creatorName: 'Agoric',
  },
  {
    id: 'ZnJ8MnhrMlYMkFcJk_pJP',
    name: 'Avril Lavigne Bite Me Canada Tour 2022 with Modsun',
    image: '',
    salePrice: 99,
    ticketsSold: 45,
    ticketsCount: 500,
    teventDetails: [
      { ticketType: 'Vip', ticketCount: 100, ticketPrice: 400 },
      { ticketType: 'General', ticketCount: 100, ticketPrice: 50 },
      { ticketType: 'Bussiness', ticketCount: 100, ticketPrice: 200 },
    ],
    creatorName: 'Agoric',
  },
  {
    id: 'fb8ApBtpIY1Ik9d62ZqFS',
    name: 'After Hours Till Dawn Tour',
    image: '',
    salePrice: 99,
    ticketsSold: 45,
    ticketsCount: 500,
    eventDetails: [
      { ticketType: 'Vip', ticketCount: 100, ticketPrice: 400 },
      { ticketType: 'General', ticketCount: 100, ticketPrice: 50 },
      { ticketType: 'Bussiness', ticketCount: 100, ticketPrice: 200 },
    ],
    creatorName: 'Agoric',
  },
  {
    id: 'J7NrtjDWJnXcbbVfTn7iG',
    name: 'Monster Jam',
    image: '',
    salePrice: 99,
    ticketsSold: 45,
    ticketsCount: 500,
    eventDetails: [
      { ticketType: 'Vip', ticketCount: 100, ticketPrice: 400 },
      { ticketType: 'General', ticketCount: 100, ticketPrice: 50 },
      { ticketType: 'Bussiness', ticketCount: 100, ticketPrice: 200 },
    ],
    creatorName: 'Agoric',
  },
];
