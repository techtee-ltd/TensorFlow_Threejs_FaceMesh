import '@mediapipe/face_mesh'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

interface Config {
    refineLandmarks: boolean
    runtime: 'mediapipe'
    solutionPath?: string
}

export default class FaceMeshDetector {
    detectorConfig: Config
    model: faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    detector: faceLandmarksDetection.FaceLandmarksDetector | null

    constructor() {
        this.model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
        this.detectorConfig = {
            runtime: 'mediapipe',
            refineLandmarks: true,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        }
        this.detector = null
    }

    private getDetector() {
        const detector = faceLandmarksDetection.createDetector(
            this.model,
            this.detectorConfig as faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig
        )
        return detector
    }

    async loadDetector() {
        this.detector = await this.getDetector()
    }

    async detectFace(source: faceLandmarksDetection.FaceLandmarksDetectorInput) {
        if (!this.detector)
            throw new Error('call the loadDetector method first on this class before calling this')
        const data = await this.detector.estimateFaces(source)
        const keypoints = (data as FaceLandmark[])[0]?.keypoints
        if (keypoints) return keypoints
        return []
    }
}
