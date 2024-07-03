import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import video1 from '../../assets/video.mp4'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import jack from '../../assets/jack.png'
import user_profile from '../../assets/user_profile.jpg'
import { API_KEY } from '../../data'
import moment from 'moment'

export const PlayVideo = ({videoId}) => {
    const value_converter=(value)=>{
        if(value>=1000000){
            return Math.floor(value/1000000)+"M"
        }
        else if(value>=1000) {
            return Math.floor(value/1000)+"K"
        }
        return value
    }

    const [channelData,setchannelData]=useState(null);
   
    const [apiData,setApiData]=useState(null);
    const [commentData,setcommentData]=useState([]);
    const fetchVideoData=async()=>{
        const videoDetails_url=`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        await fetch(videoDetails_url).then(res=>res.json()).then(data=>setApiData(data.items[0]))
    }
    const fetchChannelData=async()=>{
        const channelDetails_url=`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelDetails_url).then(res=>res.json()).then(data=>setchannelData(data.items[0]))
        const comment_url=`https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`
        await fetch(comment_url).then(res=>res.json()).then(data=>setcommentData(data.items))
    }
   
    useEffect(()=>{
        fetchVideoData();
    },[])
    useEffect(()=>{
        fetchChannelData();
    },[apiData])
  return (
    <div className='play-video'>
        {/* <video src={video1} controls autoPlay muted></video> */}
        <iframe  src={`https://www.youtube.com/embed/${videoId}?autoplay=1` } frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData?apiData.snippet.title:"Title Here"}</h3>
        <div className='play-video-info'>
            <p>{apiData?value_converter(apiData.statistics.viewCount):" "} Views&bull;{moment(apiData?apiData.snippet.publishedAt:" ").fromNow() }</p>
            <div>
            <span><img src={like}/>{apiData?value_converter(apiData.statistics.likeCount):""}</span>
            <span><img src={dislike}/></span>
            <span><img src={share}/>Share</span>
            <span><img src={save}/>Save</span>
            </div>
        </div>
        <hr/>
        <div className='publisher'>
            <img src={channelData?channelData.snippet.thumbnails.default.url:" "} alt=""/>
            <div>
            <p>{apiData?apiData.snippet.channelTitle:""}</p> 
            <span>{channelData?value_converter(channelData.statistics.subscriberCount):" "}Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        
        <div className='vid-description'>
        <p>{apiData?apiData.snippet.description:" "}</p>
        <hr/>
        <h4>{apiData?apiData.statistics.commentCount:" "}</h4>
        {commentData.map((item,index)=>{
                return(
                    <div key={index} className='comment'>
                    <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt=''/>
                <div>
                <h3> {item.snippet.topLevelComment.snippet.authorDisplayName}<span>1 day ago</span></h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className='comment-action'>
                    <img src={like} alt="" />
                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                    <img src={dislike} alt="" />
                </div>
                </div>
                </div>
                
                )
        })}
       
       
        </div>
    </div>
  )
}
