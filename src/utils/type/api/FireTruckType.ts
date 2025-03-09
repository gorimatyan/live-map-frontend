export interface FireTruckData {
    id: number;
    from: string;
    subject: string;
    body: string;
    disasterType: string;
    address: string;
    receivedAt: Date;
    latitude?: number | null;
    longitude?: number | null;
}
