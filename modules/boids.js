import * as THREE from 'three';
import tools from './tools';

const settings = {
    BOID_COUNT: 20,

    VISUAL_RANGE: 0.5,
    SEPARATION_MIN_DISTANCE: 0.2,

    SPEED_LIMIT: 0.4,

    COHESION_FACTOR: 0.3,
    SEPARATION_FACTOR: 0.3,
    ALIGNMENT_FACTOR: 0.3
}

const behaviors = {
    /**
     * 
     * @param {Boid} boid 
     * @param {BoidEnvironment} environment 
     * @return {THREE.Vector3} an influence vector
     */
    cohesion: (boid, environment) => {
        let neighbours = 0;
        let center = new THREE.Vector3(); // center of mass

        environment.boids
            .filter((other) => other !== boid)
            .forEach(other => {
                if (boid.isNear(other)) {
                    ++neighbours;
                    center.add(other.position);
                }
            });

        if (neighbours > 0) {
            center.divideScalar(neighbours);
            boid.movement.add((center.sub(boid.position).multiplyScalar(settings.COHESION_FACTOR)));
        }
    },

    separation: (boid, environment) => {
        let neighbours = 0;
        let movement = new THREE.Vector3();

        environment.boids
            .filter((other) => other !== boid)
            .forEach(other => {
                if (boid.isNear(other, settings.SEPARATION_MIN_DISTANCE)) {
                    ++neighbours;
                    movement.add(boid.position.clone().sub(other.position));
                }
            });

        boid.movement.add(movement.multiplyScalar(settings.SEPARATION_FACTOR));
    },

    alignment: (boid, environment) => {
        let neighbours = 0;
        let alignmentVector = new THREE.Vector3();

        environment.boids
            .filter((other) => other !== boid)
            .forEach(other => {
                if (boid.isNear(other)) {
                    ++neighbours;
                    alignmentVector.add(other.movement);
                }
            });

        if (neighbours > 0) {
            alignmentVector.divideScalar(neighbours);
            boid.movement.add(alignmentVector.multiplyScalar(settings.ALIGNMENT_FACTOR));
        }
    },

    speedLimiter: (boid, _environment) => {
        let speed = boid.movement.length();

        if (speed > settings.SPEED_LIMIT) {
            boid.movement.multiplyScalar(SPEED_LIMIT / speed);
        }
    }
};

class Boid {
    /**
     * 
     * @param {THREE.Vector3} position
     * @param {*} geometry
     * @param {THREE.Material} material
     */
    constructor(position, geometry, material) {
        this.position = position;

        /** @type {THREE.Vector3} */
        this.movement = tools.randomPoint();

        /** @type {THREE.Mesh} */
        this.mesh = new THREE.Mesh(geometry, material);

        this.behaviors = [
            behaviors.alignment,
            behaviors.cohesion,
            behaviors.separation,
            behaviors.speedLimiter
        ];
    }

    /**
     * 
     * @param {Boid} other
     * @return {boolean} whether this fish is close to the other 
     */
    isNear(other, threshold = settings.VISUAL_RANGE) {
        return this.position.distanceTo(other.position) < threshold;
    }

    /**
     * 
     * @param {BoidEnvironment} environment 
     */
    update(environment) {
        this.behaviors.forEach((behavior) => behavior(this, environment));
        this.position.add(this.movement);
    }

    render() {
        let mx = new THREE.Matrix4().lookAt(this.movement,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
        let qt = new THREE.Quaternion().setFromRotationMatrix(mx);
        
        this.mesh.quaternion.copy(qt);
    }
};

class BoidEnvironment {
    constructor() {
        /** @type {Boid[]} */
        this.boids = [];

        /** @type {*} */
        this.obstacles = [];

        /**
         * @type {THREE.Object3D}
         * @todo link mesh to this anchor or something
         */
        this.anchor = new THREE.Object3D();
    }

    create() {
        let geometry = new THREE.ConeGeometry(0.1, 0.2, 8, 8);
        let material = new THREE.MeshPhongMaterial({color: 0xaaaa00});

        this.boids = [];

        for (let i = 0; i < settings.BOID_COUNT ; ++i) {
            this.boids.push(new Boid(tools.randomPoint(), geometry, material));
        }
    }

    update() {
        this.boids.forEach(boid => boid.update(this));
    }
};