import "./App.css";

import React, { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import Model from "./components/Model";
import FlareIcon from "@mui/icons-material/Flare";
import VidyaIcon from "@mui/icons-material/AutoAwesome";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Button,
  Tooltip,
  Card,
  CardContent,
  Typography,
  Modal,
  ToggleButton,
} from "@mui/material";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Float,
  GizmoHelper,
  GizmoViewport,
  Cloud,
  Loader,
  Sky,
  OrbitControls,
} from "@react-three/drei";
import typeexample from "./title.glb";
import figure from "./MannequinGold.glb";

const poseDictionary = {
  0: "pranamasana - prayer pose", // 3597
  1: "hasta uttanasana - raised arms pose", // 0 - 327 s
  2: "hasta padasana - forward bend pose", // - 654 s
  3: "ashwa sanchalanasana - lunge pose", // - 981 s
  4: "chaturanga dandasana - plank pose", // - 1308 s
  5: "ashtanga namaskar - eight limb pose", // - 1635 s
  6: "bhujangasana - cobra pose", // - 1962 s
  7: "adho mukha svanasana - down dog pose", // - 2289 s
  8: "ashwa sanchalanasana - high lunge pose", // - 2616 s
  9: "hasta padasana - forward bend pose", // - 2943 s
  10: "hasta uttanasana - raised arms pose", // - 3270 s
  11: "pranamasana - prayer pose",
};

function FormattedDate(props) {
  return (
    <div
      style={{
        textAlign: "left",
      }}
    >
      <p>time: {props.date.toLocaleTimeString()}</p>
      <p>{getTimeCalc()[2]}</p>
      <p>↳ {getTimeCalc()[4]}</p>
    </div>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#000000",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: `"Chakra Petch", "Helvetica", "Arial", monospace`,
  },
  card: {
    backgroundColor: "#c5ccb6 !important",
  },
});

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div>
        <FormattedDate date={this.state.date} />
      </div>
    );
  }
}

function getTimeCalc() {
  const d = new Date();
  var currentTime = d.getTime(); // milliseconds since January 1, 1970
  var seconds = currentTime / 1000; // time in seconds
  var pose = Math.floor((seconds % 3600) / (5.4545454545454545 * 60)); // cycle is 60 mins, pose is 5.45*60 sec each
  var poseLabel = poseDictionary[pose];
  var nextAsana = poseDictionary[pose + 1];

  var posetime = seconds % (5.4545454545454545 * 60);

  //animation time
  var extraseconds = seconds % (5.4545454545454545 * 60);
  var animationTime = pose * (5.4545454545454545 * 60) + extraseconds;

  var answer = [pose + 1, posetime, poseLabel, animationTime, nextAsana];

  return answer;
}

function App() {
  const { nodes, materials } = useGLTF(typeexample);
  const [entered, setEntered] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);
  const handleOpen = () => setShowAbout(!showAbout);
  const handleClose = () => setShowAbout(false);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <div
          style={{
            position: "absolute",
            top: "2em",
            left: "2em",
            zIndex: "10000",
          }}
        >
          <Tooltip title="about the project">
            <ToggleButton
              value={showAbout}
              color="primary"
              selected={showAbout}
              onClick={handleOpen}
            >
              <FlareIcon />
            </ToggleButton>
          </Tooltip>
        </div>

        {entered && (
          <div
            style={{
              position: "absolute",
              bottom: "2em",
              left: "2em",
              zIndex: "10000",
            }}
          >
            <Clock />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "2em",
            right: "0em",
            zIndex: "10000",
          }}
        >
          <Tooltip title="vidya's website">
            <Button href="https://vidyagiri.com">
              <VidyaIcon />
            </Button>
          </Tooltip>
        </div>

        <div
          style={{
            position: "absolute",
            top: "75%",
            left: "47%",
            zIndex: "10000",
          }}
        >
          {!showAbout && !entered && (
            <Button
              size="large"
              sx={{
                color: "white",
                outlineColor: "white",
                hoverColor: "white",
                borderColor: "white",
              }}
              variant="outlined"
              value="setEntered"
              onClick={() => setEntered(true)}
            >
              enter
            </Button>
          )}
        </div>

        <Modal
          open={showAbout}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            style={{
              overflow: "scroll",
              padding: "3rem",
              position: "absolute",
              top: "5%",
              // left: "20%",
              zIndex: "10000",
            }}
          >
            <Card
              style={{
                padding: "1em",
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  about
                </Typography>
                <br />

                <Typography variant="caption" component="div">
                  suryanamaskar is a time-based digital sculpture that
                  coordinates movements of the revered suryanamaskar sequence to
                  the solar day.
                  <br></br>
                  <br></br>
                  The origin of the word suryanamaskar (सूर्यनमस्कार) is
                  Sanskrit, consisting of सूर्य (Sūrya) which means 'sun' and
                  नमस्कार (Namaskāra) which means 'greeting' or 'salute'. The
                  connected set of asanas, or poses, are performed as a part of
                  modern yoga practices where attention is places in the flow of
                  the movements and corresponding inhales and exhales.
                  <br></br>
                  <br></br>
                  This project connects the cyclical sequence of the 12 asanas
                  to our circular system of the solar day where the sequence
                  repeats once per hour and 24 times per day, and continues on
                  with the progression of time. The piece is thus connecting the
                  depicted virtual body to the physical movement of
                  suryanamaskar, allowing the body to finding connection with
                  the physical world and the sun, just as we can.
                </Typography>
                <br></br>
                <Typography variant="caption" component="div">
                  created by <a href="https://www.vidyagiri.com">Vidya Giri</a>{" "}
                  using <a href="https://reactjs.org/">react</a>,{" "}
                  <a href="https://threejs.org/">three.js</a>,{" "}
                  <a href="https://github.com/pmndrs/react-three-fiber">
                    react-three-fiber
                  </a>
                  ,<a href="https://github.com/pmndrs/drei">drei</a>,{" "}
                  <a href="https://plask.ai/">plask</a>,{" "}
                  <a href="https://www.blender.org/">blender</a>, and{" "}
                  <a href="https://mui.com/">mui</a>{" "}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Modal>

        <Canvas dpr={[1, 2]} style={{ height: "100vh", width: "100vw" }}>
          <Sky sunPosition={[100, 20, 100]} inclination={0} azimuth={0.25} />
          <Suspense fallback={null}>
            <Cloud
              opacity={0.3}
              speed={0.2} // Rotation speed
              width={10} // Width of the full cloud
              depth={1.5} // Z-dir depth
              segments={20} // Number of particles
            />
            <GizmoHelper
              alignment="top-right" // widget alignment within scene
              margin={[80, 80]} // widget margins (X, Y)
              // onUpdate={/* called during camera animation  */}
              // onTarget={/* return current camera target (e.g. from orbit controls) to center animation */}
              // renderPriority={/* use renderPriority to prevent the helper from disappearing if there is another useFrame(..., 1)*/}
            >
              <GizmoViewport
                axisColors={[
                  "rgba(255, 187, 0, 1)",
                  "rgba(220, 200, 0, 1)",
                  "rgba(255, 220, 0, 1)",
                ]}
                labelColor="gray"
                hoverColor="black"
              />
            </GizmoHelper>

            {entered && (
              <Float
                speed={1} // Animation speed, defaults to 1
                rotationIntensity={0.01} // XYZ rotation intensity, defaults to 1
                floatIntensity={0.5} // Up/down float intensity, defaults to 1
              >
                <Model
                  path={figure}
                  time={getTimeCalc()[3]}
                  position={[0, -0.4, -0.1]}
                  scale={0.25}
                />
              </Float>
            )}

            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, 10, 10]} />
            <pointLight position={[-10, 10, -10]} />
            <pointLight position={[-10, -10, -10]} />
            <pointLight position={[10, -10, 10]} />

            {!entered && (
              <Float
                speed={2} // Animation speed, defaults to 1
                rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
                floatIntensity={0.25} // Up/down float intensity, defaults to 1
              >
                <group
                  transform
                  scale={2.5}
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[-0.45, -0.3, -0.1]}
                >
                  <mesh
                    geometry={nodes.Curve.geometry}
                    material={nodes.Curve.material}
                  >
                    <meshStandardMaterial
                      attach="material"
                      wireframe={false}
                      color={"#ebc634"}
                      flatShading={true}
                      roughness={0.25}
                      metalness={0.99}
                    />
                  </mesh>
                </group>
              </Float>
            )}
          </Suspense>
          <OrbitControls
            minDistance={0.7}
            maxDistance={1.2}
            autoRotate={entered}
          />
        </Canvas>
        <Loader />
      </ThemeProvider>
    </div>
  );
}

export default App;
