{\rtf1\ansi\ansicpg949\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red255\green255\blue255;\red31\green31\blue36;\red255\green255\blue255;
}
{\*\expandedcolortbl;;\csgenericrgb\c100000\c100000\c100000\c70000;\csgenericrgb\c12054\c12284\c14131;\csgenericrgb\c100000\c100000\c100000\c85000;
}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab593
\pard\tx593\pardeftab593\pardirnatural\partightenfactor0

\f0\fs24 \cf2 \cb3 -- PostGIS \uc0\u54869 \u51109  \u54876 \u49457 \u54868  (GPS \u44228 \u49328 \u50857 )\cf4 \
\cf2 CREATE EXTENSION IF NOT EXISTS postgis;\cf4 \
\
\cf2 -- \uc0\u53440 \u51076 \u51316  \u49444 \u51221 \cf4 \
\cf2 SET timezone = 'Asia/Seoul';\cf4 \
\
\cf2 -- \uc0\u52488 \u44592  \u53580 \u51060 \u48660  \u49373 \u49457  (\u49440 \u53469 \u49324 \u54637 )\cf4 \
\cf2 CREATE TABLE IF NOT EXISTS trips (\cf4 \
\cf2     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\cf4 \
\cf2     user_id BIGINT NOT NULL,\cf4 \
\cf2     from_location VARCHAR(255),\cf4 \
\cf2     to_location VARCHAR(255),\cf4 \
\cf2     start_time TIMESTAMP,\cf4 \
\cf2     end_time TIMESTAMP,\cf4 \
\cf2     status VARCHAR(20) DEFAULT 'active',\cf4 \
\cf2     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\cf4 \
\cf2 );\cf4 \
\
\cf2 CREATE TABLE IF NOT EXISTS trip_segments (\cf4 \
\cf2     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\cf4 \
\cf2     trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,\cf4 \
\cf2     segment_type VARCHAR(20),\cf4 \
\cf2     route_id VARCHAR(50),\cf4 \
\cf2     start_time TIMESTAMP,\cf4 \
\cf2     end_time TIMESTAMP,\cf4 \
\cf2     current_stop_id INTEGER,\cf4 \
\cf2     total_stops INTEGER,\cf4 \
\cf2     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\cf4 \
\cf2 );\cf4 \
\
\cf2 CREATE INDEX idx_trip_segments_trip_id ON trip_segments(trip_id);\cf4 \
\
\cf2 CREATE TABLE IF NOT EXISTS push_requests (\cf4 \
\cf2     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\cf4 \
\cf2     user_id BIGINT NOT NULL,\cf4 \
\cf2     trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,\cf4 \
\cf2     notification_type VARCHAR(50),\cf4 \
\cf2     message TEXT,\cf4 \
\cf2     status VARCHAR(20) DEFAULT 'pending',\cf4 \
\cf2     error_message TEXT,\cf4 \
\cf2     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\cf4 \
\cf2     sent_at TIMESTAMP,\cf4 \
\cf2     UNIQUE(user_id, trip_id, notification_type)\cf4 \
\cf2 );\cf4 \
\
\cf2 CREATE INDEX idx_push_requests_status ON push_requests(status);}