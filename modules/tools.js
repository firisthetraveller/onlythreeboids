/**
 * 
 * @returns {THREE.Vector3} a point with x, y, z between -0.5 and 5
 */
function randomPoint() {
	return new THREE.Vector3(
		Math.random() - 0.5,
		Math.random() - 0.5,
		Math.random() - 0.5
	).multiplyScalar(__SETTINGS__.distanceScale);
}

const api = {
    randomPoint
};

export default api;