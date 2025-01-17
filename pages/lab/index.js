import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
  Container,
  useMediaQuery,
  Link,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import classes from "../../utils/classes";
import client from "../../utils/client";
import { urlFor, urlForThumbnail } from "../../utils/image";
import { Store } from "../../utils/Store";
import axios from "axios";
import { useRouter } from "next/router";
import LayoutProductos from "../../components/LayoutProductos";
import { RxBookmark } from "react-icons/rx";
import { RxBookmarkFilled } from "react-icons/rx";
export default function ProductScreen() {
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const [labProduct, setLabProduct] = useState({
    mangas: {},
    capota: {},
    chaleco: {
      color:"",
      image: "",
      name: "",
      price: 0,
      xs: 0,
      s: 0,
      m: 0,
      l: 0,
      xl: 0,
    },
    extensiones: {},
  });
  const [state, setState] = useState({
    product: {
      mangas: [],
      capota: [],
      chaleco: [],
      extensiones: [],
    },
    loading: true,
    error: "",
  });
  const [clicked, setclicked] = useState(true);
  const { product, loading, error } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const mangas = await client.fetch(`*[_type == "mangas"]`);
        const capota = await client.fetch(`*[_type == "capota"]`);
        const chaleco = await client.fetch(`*[_type == "chaleco"]`);
        const extensiones = await client.fetch(`*[_type == "extensiones"]`);
        console.log(mangas, capota, chaleco, extensiones);
        setLabProduct({
          chaleco: {
            color:chaleco[0].color,
            _id: chaleco[0]._id,
            image: chaleco[0].image,
            name: chaleco[0].name,
            price: chaleco[0].price,
            xs: chaleco[0].xs,
            s: chaleco[0].s,
            m: chaleco[0].m,
            l: chaleco[0].l,
            xl: chaleco[0].xl,
          },
        });
        setManga(mangas[0].tipo)
        setState({
          ...state,
          loading: false,
          product: {
            mangas: mangas,
            capota: capota,
            chaleco: chaleco,
            extensiones: extensiones,
          },
        });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, []);
  const [size, setsize] = useState("");
  const [manga, setManga] = useState("");
  const [quantity, setquantity] = useState(0);

  const addQuantity = async () => {
    if (size !== "") {
      if (size === "S" && quantity < product.s) {
        setquantity(quantity + 1);
        console.log(quantity);
      } else if (size === "M" && quantity < product.m) {
        setquantity(quantity + 1);
        console.log(quantity);
      } else if (size === "L" && quantity < product.l) {
        setquantity(quantity + 1);
      } else {
        enqueueSnackbar("Maxima cantidad alcanzada", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Selecione talla", { variant: "error" });
    }
  };
  const decQuantity = async () => {
    if (size !== "") {
      if (size === "S" && quantity > 0) {
        setquantity(quantity - 1);
        console.log(quantity);
      } else if (size === "M" && quantity > 0) {
        setquantity(quantity - 1);
        console.log(quantity);
      } else if (size === "L" && quantity > 0) {
        setquantity(quantity - 1);
      } else {
        enqueueSnackbar("La cantidad debe ser mayor a 0", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Selecione talla", { variant: "error" });
    }
  };
  const buyNowHandler = async () => {
    // const { data } = await axios.get(`/api/products/${product._id}`);

    if (quantity === 0) {
      enqueueSnackbar("Seleciona talla", { variant: "error" });

      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        _key: product._id,
        name: product.name,
        S: product.s,
        M: product.m,
        L: product.l,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image && product.image[0]),
        quantity,
        size,
      },
    });
    enqueueSnackbar(`${product.name} Agregada al Carrito`, {
      variant: "success",
    });
    router.push("/cart");
  };
  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(data);
    if (quantity === 0) {
      enqueueSnackbar("Seleciona talla", { variant: "error" });

      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: {
        _key: product._id,
        name: product.name,
        XS: product.xs,
        XL: product.xl,
        S: product.s,
        M: product.m,
        L: product.l,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image && product.image[0]),
        quantity,
        size,
      },
    });
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: "success",
    });
    router.push("/");
  };
  const [index, setIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width:600px)");
  const [selectedXs, setselecteXs] = useState(false);
  const [selectedS, setselectedS] = useState(false);
  const [selectedM, setselectedM] = useState(false);
  const [selectedL, setselectedL] = useState(false);
  const [selectedXL, setselectedXL] = useState(false);
  console.log(manga, product)
  return (
    <LayoutProductos>
      <Container sx={{ mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : (
          <Box>
            <Grid container spacing={6}>
              <Grid item md={4} xs={12} sx={{ marginTop: "70px" }}>
                <Button
                  sx={{
                    mt: 15,
                    width: "100%",
                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "0",
                    p: 1,
                    mb: 5,
                  }}
                >
                  COMO SE ARMA TU KITARA
                </Button>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    width: "100%",
                    fontSize: "1rem",
                    mb: 1,
                    fontWeight: "bold",
                  }}
                >
                  MATERIALES Y CUIDADOS
                </Typography>
                <Typography
                  variant="text"
                  component="text"
                  sx={{ mt: 10, width: "100%", fontSize: ".8rem" }}
                >
                  ALGUNA DESCRIPCIÓN DE LA PRENDA , ALGUNA DESCRIPCIÓN DE LA
                  PRENDA ALGUNA DESCRIPCIÓN DE LA PRENDA ALGUNA DESCRIPCIÓN DE
                  LA PRENDA
                </Typography>
              </Grid>
              <Grid item md={4} xs={12} sx={{ marginTop: "70px" }}>
                <Box
                  display={"flex"}
                  sx={{
                    justifyContent: "center",
                    border: "1px solid black",
                    p: 2,
                  }}
                >
                  <Image
                    className="big-image"
                    src={urlFor(labProduct.chaleco.image)}
                    key={labProduct.chaleco.image._key}
                    alt={labProduct.chaleco.name}
                    width={450}
                    height={700}
                  />
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <List>
                  <ListItem className="nopadLeft" sx={{ marginTop: "50px" }}>
                    {clicked ? (
                      <RxBookmark
                        fontSize="2.5rem"
                        onClick={() => {
                          setclicked(!clicked);
                        }}
                      />
                    ) : (
                      <RxBookmarkFilled
                        fontSize="2.5rem"
                        onClick={() => {
                          setclicked(!clicked);
                        }}
                      />
                    )}
                  </ListItem>
                  <ListItem sx={{ marginTop: "10px", padding: 0 }}>
                    <Typography
                      variant="h1"
                      component="h1"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      {labProduct.chaleco.name}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ marginTop: "10px", padding: 0 }}>
                    <Typography
                      variant="h1"
                      component="h1"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      Color Base
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ padding: 0 }}>
                  {product.chaleco.map((chaleco, key) => (
                         <Box
                         sx={{
                           backgroundColor: chaleco.color,
                           height: "20px",
                           width: "20px",
                           borderRadius: "50%",
                           marginRight:"10px",
                           cursor: "pointer"
                         }}
                         key={key}
                         onClick={() => {
                          setLabProduct({
                            ...labProduct,
                            chaleco: {
                              color: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].color,
                              _id: chaleco._id,
                              image: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].image,
                              name: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].name,
                              price: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].price,
                              xs: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].xs,
                              s: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].s,
                              m: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].m,
                              l: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].l,
                              xl: product.chaleco.filter(
                                (chale) => chale._id == chaleco._id
                              )[0].xl,
                            },
                          });
                        }}
                       ></Box>
                        ))}
                  </ListItem>
                  <ListItem
                    paddingBottom={"50px"}
                    sx={{padding: "16px 0" }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontFamily: " coolvetica, sans-serif",
                      }}
                    >
                      Tipo de Manga: {manga}
                    </Typography>
                  </ListItem>
                  <listItem>
                    <Grid container spacing={2}>
                       <Grid item>
                       <button
                         size="small"
                         variant=""
                         onClick={() => setManga("mariposa")}
                         style={selectedM ? classes.selected : classes.but}
                       >
                         MARIPOSA
                       </button>
                     </Grid>
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => setManga("iconic")}
                            style={selectedM ? classes.selected : classes.but}
                          >
                            ICONIC
                          </button>
                        </Grid>
                    </Grid>
                  </listItem>
                  <ListItem sx={{ marginTop: "10px", padding: 0 }}>
                    <Typography
                      variant="h1"
                      component="h1"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      Mangas Derechas
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ padding: 0 }}>
                    {product.mangas
                      .filter((man) => man.horientacion == "derecha" && man.tipo == manga)
                      .map((manga, key) => (
                        <Box
                          sx={{
                            backgroundColor: manga.color,
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            marginRight:"10px",
                            cursor: "pointer"
                          }}
                          key={key}
                        ></Box>
                      ))}
                  </ListItem>
                  <ListItem sx={{ marginTop: "10px", padding: 0 }}>
                    <Typography
                      variant="h1"
                      component="h1"
                      sx={{ fontSize: "1.2rem" }}
                    >
                      Mangas Izquierda
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ padding: 0 }}>
                    {product.mangas
                      .filter((man) => man.horientacion == "izquierda" && man.tipo == manga)
                      .map((manga, key) => (
                        <Box
                          sx={{
                            backgroundColor: manga.color,
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            marginRight:"10px",
                           cursor: "pointer"
                          }}
                          key={key}
                        ></Box>
                      ))}
                  </ListItem>
                  <ListItem>
                    <Typography sx={{ fontSize: "1.2rem", opacity: ".9" }}>
                      {" "}
                      $
                      {new Intl.NumberFormat().format(
                        parseInt(labProduct.chaleco.price)
                      ) + " COP"}
                    </Typography>
                  </ListItem>
                  <Divider sx={classes.line} />
                  <ListItem
                    paddingBottom={"50px"}
                    sx={{ padding: "16px 0" }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontFamily: " coolvetica, sans-serif",
                      }}
                    >
                      Talla: {size}
                    </Typography>
                  </ListItem>
                  <listItem>
                    <Grid container spacing={2}>
                      {labProduct.chaleco.xs > 0 && (
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => {
                              setsize("XS");
                              setquantity(1);
                              setselecteXs(true);
                              setselectedS(false);
                              setselectedM(false);
                              setselectedL(false);
                              setselectedXL(false);
                            }}
                            style={selectedXs ? classes.selected : classes.but}
                          >
                            XS
                          </button>
                        </Grid>
                      )}
                      {labProduct.chaleco.s > 0 && (
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => {
                              setsize("S");
                              setquantity(1);
                              setselecteXs(false);
                              setselectedS(true);
                              setselectedM(false);
                              setselectedL(false);
                              setselectedXL(false);
                            }}
                            style={selectedS ? classes.selected : classes.but}
                          >
                            S
                          </button>
                        </Grid>
                      )}
                      {labProduct.chaleco.m > 0 && (
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => {
                              setsize("M");
                              setquantity(1);
                              setselecteXs(false);
                              setselectedS(false);
                              setselectedM(true);
                              setselectedL(false);
                              setselectedXL(false);
                            }}
                            style={selectedM ? classes.selected : classes.but}
                          >
                            M
                          </button>
                        </Grid>
                      )}
                      {labProduct.chaleco.l > 0 && (
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => {
                              setsize("L");
                              setselecteXs(false);
                              setselectedS(false);
                              setselectedM(false);
                              setselectedL(true);
                              setselectedXL(false);
                              setquantity(1);
                            }}
                            style={selectedL ? classes.selected : classes.but}
                          >
                            L
                          </button>
                        </Grid>
                      )}
                      {labProduct.chaleco.xl > 0 && (
                        <Grid item>
                          <button
                            size="small"
                            variant=""
                            onClick={() => {
                              setsize("L");
                              setselecteXs(false);
                              setselectedS(false);
                              setselectedM(false);
                              setselectedL(false);
                              setselectedXL(true);
                              setquantity(1);
                            }}
                            style={selectedXL ? classes.selected : classes.but}
                          >
                            XL
                          </button>
                        </Grid>
                      )}
                    </Grid>
                  </listItem>
                  <Divider
                    sx={{
                      mt: 5,
                      border: "1px solid white",
                      borderTop: "1px solid black",
                      height: "2px",
                      opacity: "1",
                      width: "97%",
                    }}
                  />
                  <ListItem>
                    {" "}
                    <NextLink href={"/"} passHref>
                      <Link
                        sx={{
                          color: "black",

                          textDecoration: "none",
                          "&:hover": {
                            color: "black",
                            textDecoration: "underline",
                          },
                        }}
                      >
                        GUIA DE TALLAS
                      </Link>
                    </NextLink>
                  </ListItem>
                  <ListItem>
                    <Button
                      sx={classes.blackline}
                      onClick={addToCartHandler}
                      fullWidth
                      variant=""
                    >
                      Agregar al carrito
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={buyNowHandler}
                      fullWidth
                      variant="contained"
                      sx={classes.buyNow}
                    >
                      Comprar ahora
                    </Button>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </LayoutProductos>
  );
}
