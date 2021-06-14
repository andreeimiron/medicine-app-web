import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '49%',
    marginBottom: '35px',
    height: 'fit-content'
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    margin: '0 -20px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const PostCard = ({ title, subtitle, image, paragraphs }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardContent >
        <Typography variant="h5" style={{ marginBottom: '25px', marginTop: '15px' }} component="p">
          {title}
        </Typography>
        <CardMedia
          className={classes.media}
          image={image}
          title="Paella dish"
        />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
          <Typography variant="subtitle1" component="p">
            {subtitle}
          </Typography>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </div>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {paragraphs && paragraphs.map((paragraph) => (
            <React.Fragment>
              {paragraph.title && (
                <Typography paragraph>
                  {paragraph.title}
                </Typography>
              )}
              {paragraph.text && (
                <Typography paragraph>
                  {paragraph.text}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default PostCard;
