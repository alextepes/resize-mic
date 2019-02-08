import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const StatsSchema = new Schema({
    name: {
        type: String,
        required: 'Enter a name for this stat'
    },
    value: {
        type: Number,
        required: 'Stat value is required'
    }
});