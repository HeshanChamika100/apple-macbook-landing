import {Canvas} from "@react-three/fiber";
import StudioLights from "./three/StudioLights.jsx";
import {features, featureSequence} from "../constants/index.js";
import clsx from "clsx";
import {Suspense, useEffect, useRef} from "react";
import {Html} from "@react-three/drei";
import MacbookModel from "./models/Macbook.jsx";
import {useMediaQuery} from "react-responsive";
import useMacbookStore from "../store/index.js";
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';

const ModelScroll = () => {
    const groupRef = useRef(null);
    const videosRef = useRef([]);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)'})
    const { setTexture } = useMacbookStore();

    // Pre-load all feature videos during component mount
    useEffect(() => {
        // Create a hidden container for video elements if needed
        const container = document.createElement('div');
        container.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; visibility: hidden;';
        document.body.appendChild(container);

        featureSequence.forEach((feature) => {
            const v = document.createElement('video');

            Object.assign(v, {
                src: feature.videoPath,
                muted: true,
                playsInline: true,
                preload: 'auto',
                crossOrigin: 'anonymous',
            });

            v.load();
            
            // Store in ref for potential reuse
            videosRef.current.push(v);
            
            // Append to hidden container
            container.appendChild(v);
        });

        // Cleanup function to release video resources
        return () => {
            videosRef.current.forEach((v) => {
                // Pause the video
                v.pause();
                
                // Remove all event listeners by cloning and replacing
                const clone = v.cloneNode(true);
                v.parentNode?.replaceChild(clone, v);
                
                // Remove source to release memory
                clone.removeAttribute('src');
                clone.src = '';
                
                // Clear srcObject if any
                clone.srcObject = null;
                
                // Force the browser to release buffers
                clone.load();
                
                // Remove from DOM
                clone.remove();
            });
            
            // Clear the ref array
            videosRef.current = [];
            
            // Remove the container
            container.remove();
        };
    }, []);

    useGSAP(() => {
        // 3D MODEL ROTATION ANIMATION
        const modelTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#f-canvas',
                start: 'top top',
                end: 'bottom  top',
                scrub: 1,
                pin: true,
            }
        });

        // SYNC THE FEATURE CONTENT
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: '#f-canvas',
                start: 'top center',
                end: 'bottom  top',
                scrub: 1,
            }
        })

        // 3D SPIN
        if(groupRef.current) {
            modelTimeline.to(groupRef.current.rotation, { y: Math.PI * 2, ease: 'power1.inOut'})
        }

        // Content & Texture Sync
        timeline
            .call(() => setTexture('/videos/feature-1.mp4'))
            .to('.box1', { opacity: 1, y: 0, delay: 1 })

            .call(() => setTexture('/videos/feature-2.mp4'))
            .to('.box2', { opacity: 1, y: 0 })

            .call(() => setTexture('/videos/feature-3.mp4'))
            .to('.box3', { opacity: 1, y: 0 })

            .call(() => setTexture('/videos/feature-4.mp4'))
            .to('.box4', { opacity: 1, y: 0})

            .call(() => setTexture('/videos/feature-5.mp4'))
            .to('.box5', { opacity: 1, y: 0 })
    }, []);

    return (
        <group ref={groupRef}>
            <Suspense fallback={<Html><h1 className="text-white text-3xl uppercase">Loading...</h1></Html>}>
                <MacbookModel scale={isMobile ? 0.05 : 0.08} position={[0, -1, 0]} />
            </Suspense>
        </group>
    )
}

const Features = () => {
    return (
        <section id="features">
            <h2>See it all in a new light.</h2>

            <Canvas id="f-canvas">
                <StudioLights />
                <ambientLight intensity={0.5} />
                <ModelScroll />
            </Canvas>

            <div className="absolute inset-0">
                {features.map((feature, index) => (
                    <div key={feature.id} className={clsx('box', `box${index + 1}`, feature.styles)}>
                        <img src={feature.icon} alt={feature.highlight} />
                        <p>
                            <span className="text-white">{feature.highlight}</span>
                            {feature.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Features