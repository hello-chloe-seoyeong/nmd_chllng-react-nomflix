import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAiringTvShows,
  getPopularTvShows,
  getTopRatedTvShows,
  getTvShows,
  IGetTvShowsResult,
} from "../api";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 60px;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  /* position: absolute; */
  width: 100%;
  overflow: hidden;
  margin-bottom: 10px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: #fff;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  gap: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  h4 {
    font-size: 18px;
    text-align: center;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigTv = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;
function Tv() {
  const navigate = useNavigate();
  const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvId");

  const widthRef = useRef(window.outerWidth);
  const { scrollY } = useScroll();
  const { data, error, isLoading } = useQuery<IGetTvShowsResult>({
    queryKey: ["tv", "latest"],
    queryFn: getTvShows,
  });

  const {
    data: data_airing,
    error: error_airing,
    isLoading: isLoading_airing,
  } = useQuery<IGetTvShowsResult>({
    queryKey: ["tv", "airing"],
    queryFn: getAiringTvShows,
  });

  const {
    data: data_popular,
    error: error_popular,
    isLoading: isLoading_popular,
  } = useQuery<IGetTvShowsResult>({
    queryKey: ["tv", "popular"],
    queryFn: getPopularTvShows,
  });

  const {
    data: data_topRated,
    error: error_topRated,
    isLoading: isLoading_topRated,
  } = useQuery<IGetTvShowsResult>({
    queryKey: ["tv", "topRated"],
    queryFn: getTopRatedTvShows,
  });

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    (data?.results.find((tv) => tv.id + "" === bigTvMatch.params.tvId) ||
      data_airing?.results.find(
        (tv) => tv.id + "" === bigTvMatch.params.tvId
      ) ||
      data_popular?.results.find(
        (tv) => tv.id + "" === bigTvMatch.params.tvId
      ) ||
      data_topRated?.results.find(
        (tv) => tv.id + "" === bigTvMatch.params.tvId
      ));

  useEffect(() => {
    const updateWidth = () => (widthRef.current = window.outerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  return (
    <Wrapper>
      {isLoading ||
      isLoading_airing ||
      isLoading_popular ||
      isLoading_topRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={{ x: widthRef.current + 10 }}
                animate={{ x: 0 }}
                exit={{ x: -widthRef.current - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={{ x: widthRef.current + 10 }}
                animate={{ x: 0 }}
                exit={{ x: -widthRef.current - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data_airing?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={{ x: widthRef.current + 10 }}
                animate={{ x: 0 }}
                exit={{ x: -widthRef.current - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data_popular?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(tv.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      ></BigCover>
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
