import React from 'react';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PostCard from "../components/PostCard";
import Post1 from '../../../assets/images/post1.jpeg';
import Post2 from '../../../assets/images/post2.jpeg';
import Post3 from '../../../assets/images/post3.png';
import Consultations from "../../consultations/containers/Consultations";

const posts = [
  {
    title: 'Măsuri de prevenție privind infectarea cu noul coronavirus COVID-19',
    subtitle: 'Noul coronavirus (Covid-19) este un virus ce face parte din aceeași familie de virusuri care stau la ' +
      'baza anumitor tipuri de răceala sau a sidromului respirator acut sever (SARS) și poate fi transmis prin:' +
      'contact direct, picături de salivă eliminate prin tuse sau strănut, dar si prin atingerea suprafețelor ' +
      'contaminate.',
    image: Post1,
    paragraphs: [
      {
        title: 'Cum prevenim infectarea cu acest virus?',
        text: 'Spălatul mâinilor frecvent cu apă și săpun sau cu dezinfectant de mâini pe bază de alcool elimină ' +
          'virusul dacă acesta se află pe mâini. Păstrați o distanță de cel puțin 1 metru față de persoanele care ' +
          'tușesc sau au febră. Când acestea tușesc sau strănută se eliberează mici picături de salivă care pot' +
          'conține virusul, iar dacă sunteți prea aproape de ele le puteți inhala.'
      },
      {
        title: '',
        text: 'Evitați atingerea ochilor, nasului și a gurii! Mâinile vin în contact cu multe suprafețe care pot fi ' +
          'contaminate iar prin atingerea ochilor, nasului și a gurii favorizăm infectarea cu virusuri. Dacă aveți ' +
          'febră, dificultăți de respirație și tușiți, sunați medicul de familie. Spuneți-i acestuia dacă ați ' +
          'călătorit recent în afara țării sau ați avut contact apropiat cu o persoană care s-a întors recent ' +
          'din aceste zone și are simptome respiratorii.'
      },
      {
        title: '',
        text: ''
      },
      {
        title: 'Stiati ca?',
        text: 'Animalele de companie nu transmit noul coronavirus! Nu există dovezi că animalele de companie, câini ' +
          'și pisici, pot fi infectate de virus. În orice caz, trebuie să ne spălăm tot timpul mâinile cu apă și ' +
          'săpun după ce intrăm în contact cu animalele de companie.'
      },
      {
        title: '',
        text: 'Purtând o mască medicală (dacă avem simptome respiratorii) putem ajuta la împiedicarea răspândirii' +
          ' unor afecțiuni respiratorii. Totuși, doar această măsură nu garantează oprirea infecțiilor și ar trebui ' +
          'combinată cu celelalte măsuri de prevenție: igiena mâinilor și a respirației, păstrarea distanței de cel ' +
          'puțin 1 metru între persoane.'
      }
    ]
  },
  {
    title: 'Spălarea corectă a mâinilor',
    subtitle: 'Multe boli se pot transmite doar pentru ca nu ne spalam pe maini cu apa si sapun. O igiena adecvata a ' +
      'mainilor este una dintre cele mai bune metode de a preveni raspandirea bacteriilor si a virusurilor.',
    image: Post2,
    paragraphs: [
      {
        title: 'Spălarea corectă a mâinilor',
        text: 'Pasul 1: Udă bine mâinile cu apă.'
      },
      {
        title: '',
        text: 'Pasul 2: Adaugă o cantitate optima de săpun.'
      },
      {
        title: '',
        text: 'Pasul 3: Freacă mâinile intens, una de cealaltă, pentru a face spumă.'
      },
      {
        title: '',
        text: 'Pasul 4: Freacă spatele palmei, viguros, cu cealaltă mână.'
      },
      {
        title: '',
        text: 'Pasul 5: Freacă mâinile si între degete.'
      },
      {
        title: '',
        text: 'Pasul 6: Freacă energic podul palmei cu degetele împreunate ale celeilalte mâini.'
      },
      {
        title: '',
        text: 'Pasul 7: Freacă bine degetul mare şi încheietura mâinii.'
      },
      {
        title: '',
        text: 'Pasul 8: Freacă bine degetul mare şi încheietura mâinii.'
      },
      {
        title: '',
        text: 'Pasul 9: Clăteşte bine mâinile şi apoi usucă-le bine.'
      },
      {
        title: '',
        text: 'Retine acesti pasi si indruma si alte persoane sa se spele corect pe maini.'
      },
    ]
  },
  {
    title: 'Vitamina C si rolul ei in organismul uman',
    subtitle: 'Vitamina C nu este produsa de organism, de aceea aportul exogen constant este obligatoriu pentru o' +
      ' buna stare de sanatate. Lipsa vitaminei C se manifesta prin stare de oboseala, slabiciune sau dureri musculare' +
      ' si articulare, intarziere in vindecarea ranilor, leziunilor, plagilor. ',
    image: Post3,
    paragraphs: [
      {
        title: 'Care este rolul vitaminei C?',
        text: 'Sursele de vitamina C sunt legumele si fructele proaspete printre care, banalul patrunjel se pare ca ' +
          'are cea mai mare concentratie de vitamina C, mai mult decat celebrele citrice. Mai mult decat atat, ' +
          'vitamina C a fost obiect de studiu multi ani si se stie ca este implicata si in formarea vaselor de sange,' +
          ' a cartilajului, a muschilor si este vitala pentru procesul de vindecare. Ca antioxidant, vitamina C ar ' +
          'putea ajuta la protejarea celulelor impotriva deteriorarii cauzate de radicalii liberi chimici, substante ' +
          'implicate in producerea afectiunilor cardiace, cancer si a altor boli. '
      },
      {
        title: '',
        text: 'Posibilele efecte benefice atribuite vitaminei C includ si reducerea disfunctiei la nivelul' +
          'endoteliului vascular, gestionarea hipertensiunii arteriale, reducerea riscului de boli cardiovasculare, ' +
          'prevenirea accidentului vascular cerebral, a anumitor tipuri de cancer, a diabetului, a gutei și, posibil,' +
          ' a bolii Alzheimer. Datele despre aceste posibile beneficii sunt controversate, chiar contradictorii ' +
          'uneori si nu este clar daca aceste posibile efecte se datoreaza, chiar si partial, unei suplimentari a ' +
          'vitaminei C in alimentatie. '
      },
      {
        title: '',
        text: 'In prezent, foarte putine dovezi stiintifice sustin beneficiul administrarii unor doze mari de ' +
          'vitamina C pentru imunitate la persoanele sanatoase si multi autori au subliniat ca aceasta practica ' +
          'este ineficienta pentru prevenirea racelii comune si a infectiilor virale la majoritatea subiectilor.'
      },
      {
        title: '',
        text: 'Se stie ca utilizarea regulata a suplimentelor de vitamina C scurteaza durata racelii obisnuite, dar ' +
          'nu reduce riscul de a contracta o raceala, cu exceptia persoanelor supuse unui stres fizic puternic ' +
          '(de exemplu, alergatori de maraton, schiori sau soldati aflati in conditii subarctice), in cazul carora ' +
          'incidenta racelilor a fost redusa la jumatate. Administrarea suplimentelor de vitamina C dupa ce ' +
          'simptomele de raceala au aparut, nu are beneficii demonstrate.'
      }
    ]
  }
];

const useStyles = makeStyles(() => ({
  posts: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    '&:not(:nth-child(2n))': {
      marginRight: '15px'
    }
  },
}));

const Home = () => {
  const classes = useStyles();
  const loggedUser = JSON.parse(localStorage.getItem('user')) || {};
  const isDoctor = loggedUser.role === 'medic';

  return (
    <div>
      {isDoctor && <Consultations/>}
      <Typography variant="h5" style={{ margin: '45px 0'}} gutterBottom>
        Informatii de interes general
      </Typography>
      <div className={classes.posts}>
        {posts && posts.map((post) => (
          <PostCard
            title={post.title}
            subtitle={post.subtitle}
            image={post.image}
            paragraphs={post.paragraphs}
          />
        ))}
      </div>
    </div>
  )
};

export default Home;
